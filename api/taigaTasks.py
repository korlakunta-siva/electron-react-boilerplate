import datetime
import os
import sys
import psycopg2
import psycopg2.extras
import markdown
import pandas as pd
import numpy as np
from sys import platform as _platform
import argparse


def filterTagsCheck(filterTags, hasTags, tags):
    if filterTags == False:
        return True
    else:
        return False


def execAsDict(conn, query):
    cursor = conn.cursor()
    cursor.execute(query)
    columns = [column[0] for column in cursor.description]
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    return results


def getHref(project_slug, reftype, refid, reftext):
    if reftype == "proj":
        href = "<a href='" + "https://korlakunta.com/project/" + \
            project_slug + "/kanban' >" + reftext + "</a>"
    else:
        href = "<a href='" + "https://korlakunta.com/project/" + \
            project_slug + "/" + reftype + "/" + refid + "' >" + reftext + "</a>"
    return href


def sivatasks():

    now = datetime.datetime.now()
    htmlText = ""

    inProgressOnly = True
    inProgressOnly = False

    project_id = 17
    project_slug = ""
    projects = []
    project = []
    userstories = []
    ustasks = []
    issues = []
    wikipages = []
    include_Wiki = False
    include_desc = False
    filterTags = False
    hasTags = []

    exclude_projects = []  # [8, 7, 16,  17]

    projectUS = []
    projectCurrentUS = []
    projectCurrentUSTasks = []
    projectIssues = []

    result = []


    try:
        conn = psycopg2.connect(
            host="192.168.1.15",
            database="taiga",
            user="siva",
            password="siva123")

        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        all_projects_Query = "select *  from projects_project "

        cursor.execute(all_projects_Query)
        projects = cursor.fetchall()

        for proj in projects:

            result_project = {}
            project_id = proj[0]
            project_slug = proj[3]

            if project_id in exclude_projects:
                continue
            projectsselect_Query = "select *  from projects_project where id = " + \
                str(project_id)
            us_select_Query = """select  us.id
    ,tags
    ,version
    ,is_blocked
    ,blocked_note
    ,ref
    ,us.is_closed
    ,backlog_order
    ,created_date
    ,modified_date
    ,finish_date
    ,subject
    ,description
    ,client_requirement
    ,team_requirement
    ,assigned_to_id
    ,generated_from_issue_id
    ,milestone_id
    ,owner_id
    ,us.project_id
    ,status_id
    ,sprint_order
    ,kanban_order
    ,external_reference
    ,tribe_gig
    ,due_date
    ,due_date_reason
    ,generated_from_task_id
    ,st.name,st.order, st.is_closed, st.slug, st.is_archived
    from public.userstories_userstory us, public.projects_userstorystatus st
    where us.status_id = st.id
    and us.is_closed = False and us.project_id = """ + str(project_id)

            tasks_select_Query = """
                select  ut.id
    ,tags
    ,version
    ,is_blocked
    ,blocked_note
    ,ref
    ,created_date
    ,modified_date
    ,finished_date
    ,subject
    ,description
    ,is_iocaine
    ,assigned_to_id
    ,milestone_id
    ,owner_id
    ,ut.project_id
    ,status_id
    ,user_story_id
    ,taskboard_order
    ,us_order
    ,external_reference
    ,due_date
    ,due_date_reason
    ,st.name,st.order, st.is_closed, st.slug
    from public.tasks_task ut,  public.projects_taskstatus st
    where ut.status_id = st.id
    and st.is_closed = False
    and ut.project_id = """ + str(project_id)

            issues_select_Query = """
                select  ii.id
    ,tags
    ,version
    ,is_blocked
    ,blocked_note
    ,ref
    ,created_date
    ,modified_date
    ,finished_date
    ,subject
    ,description
    ,assigned_to_id
    ,milestone_id
    ,owner_id
    ,priority_id
    ,ii.project_id
    ,severity_id
    ,status_id
    ,type_id
    ,external_reference
    ,due_date
    ,due_date_reason
    ,st.name,st.order, st.is_closed, st.slug
    from public.issues_issue ii, public.projects_issuestatus st
    where ii.status_id = st.id
    and name != 'Closed'
    and ii.project_id = """ + str(project_id)

            if inProgressOnly == True:
                us_select_Query = us_select_Query + """
                    and status_id in (select id from projects_userstorystatus where slug = 'in-progress' )
                    """
                tasks_select_Query = tasks_select_Query + """
                    and status_id in (select id from projects_taskstatus where slug = 'in-progress' )
                    """
                issues_select_Query = issues_select_Query + """
                    and status_id in (select id from projects_issuestatus where slug = 'in-progress' )
                    """

            wiki_select_Query = """select lin.id
            ,title
            ,slug
            ,content
            ,lin.project_id
            from public.wiki_wikipage, public.wiki_wikilink lin
            where href = slug and lin.project_id = """ + str(project_id)
            cursor.execute(projectsselect_Query)
            project = cursor.fetchone()
            userstories = execAsDict(conn, us_select_Query)
            ustasks = execAsDict(conn, tasks_select_Query)
            issues = execAsDict(conn, issues_select_Query)
            wikipages = execAsDict(conn, wiki_select_Query)

            result_project['issues'] = issues

            result_project['us'] = userstories

            for row in userstories:

                result_project_us = {}

                result_project_us['us'] = row
          
                projectCurrentUSTasks = []
                for taskrow in ustasks:
                    if taskrow['user_story_id'] == row['id']:
                        projectCurrentUSTasks.append(taskrow) 

                result_project_us['tasks'] = projectCurrentUSTasks

            projectWikiPages = []
            for row in wikipages:
                projectWikiPages.append(row)

            result_project['wiki'] = projectWikiPages

            result.append(result_project)

                   
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        # closing database connection.
        if(conn):
            cursor.close()
            conn.close()

    return (result)



def sivataskslinks(searchtext):

    now = datetime.datetime.now()
    htmlText = ""

    inProgressOnly = True
    inProgressOnly = False

    project_id = 17
    project_slug = ""
    projects = []
    project = []
    userstories = []
    ustasks = []
    issues = []
    wikipages = []
    include_Wiki = False
    include_desc = False
    filterTags = False
    hasTags = []

    exclude_projects = []  # [8, 7, 16,  17]

    projectUS = []
    projectCurrentUS = []
    projectCurrentUSTasks = []
    projectIssues = []

    result = []


    try:
        conn = psycopg2.connect(
            host="192.168.1.15",
            database="taiga",
            user="siva",
            password="siva123")

        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

        all_projects_Query = "select *  from projects_project "

        cursor.execute(all_projects_Query)
        projects = cursor.fetchall()

        for proj in projects:

            result_project = {}
            project_id = proj[0]
            project_slug = proj[3]

            if project_id in exclude_projects:
                continue
            projectsselect_Query = "select *  from projects_project where id = " + \
                str(project_id)
            us_select_Query = """select  us.id
    ,tags
    ,version
    ,is_blocked
    ,blocked_note
    ,ref
    ,us.is_closed
    ,backlog_order
    ,created_date
    ,modified_date
    ,finish_date
    ,subject
    ,description
    ,client_requirement
    ,team_requirement
    ,assigned_to_id
    ,generated_from_issue_id
    ,milestone_id
    ,owner_id
    ,us.project_id
    ,status_id
    ,sprint_order
    ,kanban_order
    ,external_reference
    ,tribe_gig
    ,due_date
    ,due_date_reason
    ,generated_from_task_id
    ,st.name,st.order, st.is_closed, st.slug, st.is_archived
    from public.userstories_userstory us, public.projects_userstorystatus st
    where us.status_id = st.id
    and us.is_closed = False and us.project_id = """ + str(project_id)

            tasks_select_Query = """
                select  ut.id
    ,tags
    ,version
    ,is_blocked
    ,blocked_note
    ,ref
    ,created_date
    ,modified_date
    ,finished_date
    ,subject
    ,description
    ,is_iocaine
    ,assigned_to_id
    ,milestone_id
    ,owner_id
    ,ut.project_id
    ,status_id
    ,user_story_id
    ,taskboard_order
    ,us_order
    ,external_reference
    ,due_date
    ,due_date_reason
    ,st.name,st.order, st.is_closed, st.slug
    from public.tasks_task ut,  public.projects_taskstatus st
    where ut.status_id = st.id
    and st.is_closed = False
    and ut.project_id = """ + str(project_id)

            issues_select_Query = """
                select  ii.id
    ,tags
    ,version
    ,is_blocked
    ,blocked_note
    ,ref
    ,created_date
    ,modified_date
    ,finished_date
    ,subject
    ,description
    ,assigned_to_id
    ,milestone_id
    ,owner_id
    ,priority_id
    ,ii.project_id
    ,severity_id
    ,status_id
    ,type_id
    ,external_reference
    ,due_date
    ,due_date_reason
    ,st.name,st.order, st.is_closed, st.slug
    from public.issues_issue ii, public.projects_issuestatus st
    where ii.status_id = st.id
    and name != 'Closed'
    and ii.project_id = """ + str(project_id)

            if inProgressOnly == True:
                us_select_Query = us_select_Query + """
                    and status_id in (select id from projects_userstorystatus where slug = 'in-progress' )
                    """
                tasks_select_Query = tasks_select_Query + """
                    and status_id in (select id from projects_taskstatus where slug = 'in-progress' )
                    """
                issues_select_Query = issues_select_Query + """
                    and status_id in (select id from projects_issuestatus where slug = 'in-progress' )
                    """

            wiki_select_Query = """select lin.id
            ,title
            ,slug
            ,content
            ,lin.project_id
            from public.wiki_wikipage, public.wiki_wikilink lin
            where href = slug and lin.project_id = """ + str(project_id)
            cursor.execute(projectsselect_Query)
            project = cursor.fetchone()
            userstories = execAsDict(conn, us_select_Query)
            ustasks = execAsDict(conn, tasks_select_Query)
            issues = execAsDict(conn, issues_select_Query)
            wikipages = execAsDict(conn, wiki_select_Query)

            result_project['issues'] = issues

            result_project['us'] = userstories

            for row in userstories:

                result_project_us = {}

                result_project_us['us'] = row
          
                projectCurrentUSTasks = []
                for taskrow in ustasks:
                    if taskrow['user_story_id'] == row['id']:
                        projectCurrentUSTasks.append(taskrow) 

                result_project_us['tasks'] = projectCurrentUSTasks

            projectWikiPages = []
            for row in wikipages:
                projectWikiPages.append(row)
                
            result_project['wiki'] = projectWikiPages

            result.append(result_project)

                   
    except (Exception, psycopg2.Error) as error:
        print("Error while fetching data from PostgreSQL", error)
    finally:
        # closing database connection.
        if(conn):
            cursor.close()
            conn.close()

    return (result)


def main():

    parser = argparse.ArgumentParser(
        description="Python Local OS Commands Runner")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-v", "--verbose", action="store_true")
    group.add_argument("-q", "--quiet", action="store_true")
    parser.add_argument("-cmd", help="command_to_run")
    parser.add_argument("-a", "--arg", help="args", default=None)
    parser.add_argument("-dbserv", help="dbserv", default=None)
    parser.add_argument("-sql", "--sql", help="sql", default=None)
    parser.add_argument("-p", "--pid", type=int, help="pid", default=None)
    args = parser.parse_args()

    command = None
    hostname = None
    pid = None

    if args.cmd:
        command = args.cmd
    if args.arg:
        arguments = args.arg
    if args.pid:
        pid = args.pid
    if args.dbserv:
        dbserver = args.dbserv
    if args.sql:
        sqltext = args.sql

    try:

        if command.strip() == 'tasks':
            # createStackFile("api/")
            tasksJson = sivataskslinks('CIG')
            print(tasksJson)

            sys.exit(0)

        if command.strip() == 'getdb':
            # createStackFile("api/")
            getdbinfo(dbserver, sqltext)

            sys.exit(0)

        if command.strip() == 'parse':
            filepath = arguments  # "42_19780259-1_1.2.840.113717.2.19780259.1_1.3.6.1.4.1.25403.1322.6188.20120314113107.1717.2.19780259.1.img"
            # createStackFile("api/")
            parsestack(filepath)

            sys.exit(0)

        if command.strip() == 'tounix':
            print("tounix ->  " + arguments)
            print(configureMountPoint(arguments))
            sys.exit(0)

        if command.strip() == 'towin':
            print("towin -> " + arguments)
            print(reverseMountPoints(arguments))
            sys.exit(0)

    except Exception as e:
        print(e)
        pass


if __name__ == "__main__":
    main()
