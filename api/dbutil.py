import pyodbc
import pandas as pd
from sqlalchemy import engine, create_engine
import numpy as np
import pandas as pd
from sys import platform as _platform
import argparse
from iocmutil import getIOCMReprocessSQL


class MailUtil(object):
    @staticmethod
    def SendMail(subject,
                 message,
                 fromuser,
                 tousers,
                 ccusers=None,
                 bccusers=None):
        #send_mail(
        #     subject,
        #     message,
        #     fromuser,
        #     tousers,
        #      fail_silently=False,
        #)

        html_content = '<p>This is an <strong>important</strong> message.</p>'
        msg = EmailMultiAlternatives(subject,
                                     message,
                                     fromuser,
                                     to=tousers,
                                     cc=ccusers,
                                     bcc=bccusers)
        #msg.attach_alternative(html_content, "text/html")
        msg.send()

    @staticmethod
    def sendPS360Email(subject, message, fromuser, tousers, ccusers=None):
        send_mail(
            subject,
            message,
            fromuser,
            tousers,
            fail_silently=False,
        )


#subject, from_email, to = 'hello', 'from@example.com', 'to@example.com'
#text_content = 'This is an important message.'
#html_content = '<p>This is an <strong>important</strong> message.</p>'
#msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
#msg.attach_alternative(html_content, "text/html")
#msg.send()

#msg = EmailMultiAlternatives(subject, text_content, from_email, [to_email], bcc=[bcc_email], cc=[cc_email])

#MailMessage mail = new MailMessage();
#mail.From = new MailAddress(EmailAddress);
#mail.To.Add(EmailAddress);
#//mail.CC.Add("tjelta.jason@mayo.edu");
#mail.CC.Add("tjelta.jason@mayo.edu");
#mail.CC.Add("Anderson.Timothy@mayo.edu");
#mail.Bcc.Add("korlakunta.siva@mayo.edu");
#SmtpClient client = new SmtpClient();
#client.Port = 25;
#client.DeliveryMethod = SmtpDeliveryMethod.Network;
#client.UseDefaultCredentials = false;
#client.Host = "smtprelay.mayo.edu";
#mail.Subject = "PS360Status->" + action + "  " + srv;
#mail.Body = "";
#client.Send(mail);


class DBUtil(object):
    """description of class"""
    @staticmethod
    def GetConnectionURL(servername, databasename):

        serv_hostname = None
        serv_port = None
        serv_databasename = databasename

        if servername == 'iims_oltp':
            serv_hostname = "iims-oltp-ip.mayo.edu"
            serv_port = "2031"

        if servername == 'iims_rpt':
            serv_hostname = "rims-mcr-rpt-ip.mayo.edu"
            serv_port = "2025"

        if servername == 'iims_test':
            serv_hostname = "iims-test-ip.mayo.edu;"
            serv_port = "2025"

        engine_url = "sybase+pyodbc://mra9895:PassWD@" + serv_hostname + ':' + serv_port + '/' + serv_databasename + '?driver=FreeTDS'
        return engine_url

    @staticmethod
    def GetConnection(servername, userid, password):
        #        if _platform == "linux" or _platform == "linux2":
        #   # linux
        #elif _platform == "darwin":
        #   # MAC OS X
        #elif _platform == "win32":
        #   # Windows
        #elif _platform == "win64":
        #    # Windows 64-bit

        if (_platform == "linux"
                or _platform == "linux2") and servername == 'iims_oltp':
            cnxn = pyodbc.connect(
                "DRIVER=FreeTDS;"
                "SERVER=iims-oltp-ip.mayo.edu;"
                "port=2031;"
                "UID=mra9895;"
                "pwd=PassWD;"
                "Database=iimdb_rch01_prod",
                autocommit=True)
            #  iims-oltp-ip.mayo.edu 2031
            # qreads_oltp qreads-oltp-ip.mayo.edu 2030
            return cnxn
        if (_platform == "win32"
                or _platform == "win64") and servername == 'iims_oltp':
            cnxn = pyodbc.connect(
                "DSN=iims_oltp;"
                "port=2031;"
                "UID=mra9895;"
                "pwd=PassWD;"
                "Database=iimdb_rch01_prod",
                autocommit=True)
            #  iims-oltp-ip.mayo.edu 2031
            # qreads_oltp qreads-oltp-ip.mayo.edu 2030
            return cnxn

        if servername == 'iims_rpt':
            cnxn = pyodbc.connect(
                "DRIVER=FreeTDS;"
                "SERVER=rims-mcr-rpt-ip.mayo.edu;"
                "port=2025;"
                "UID=mra9895;"
                "pwd=PassWD;"
                "Database=iimdb_rch01_arch",
                autocommit=True)
            #  iims-oltp-ip.mayo.edu 2031
            # qreads_oltp qreads-oltp-ip.mayo.edu 2030
            return cnxn

        if servername == 'iims_test':
            cnxn = pyodbc.connect(
                "DRIVER=FreeTDS;"
                "SERVER=iims-test-ip.mayo.edu;"
                "port=2025;"
                "UID=mra9895;"
                "pwd=PassWD;"
                "Database=qrddb_rch03_test",
                autocommit=True)
            #  iims-oltp-ip.mayo.edu 2031
            # qreads_oltp qreads-oltp-ip.mayo.edu 2030
            return cnxn

        #                          "port=2025;"
        if servername == 'dashboard_local':
            cnxn = pyodbc.connect(
                "DRIVER={ODBC Driver 17 for SQL Server};"
                "SERVER=R5038244.mfad.mfroot.org,49195;"
                "PORT=49195;"
                "UID=sa;"
                "PWD=imsu2019;"
                "Database=dashboard",
                autocommit=True)
            #iims_test  iims-test-ip.mayo.edu,2025
            return cnxn

        # define odbc DSN in both 32 bit and 64 bit

    @staticmethod
    def getsizeinMB(sizestring):
        if (type(sizestring) != str):
            return sizestring
        #print("{0} => {1} ".format(sizestring, type(sizestring)))
        sizenum = 0
        if 'KB' in sizestring:
            sizenum = float(sizestring.replace('KB', '')) / 1024
            return sizenum
        elif 'MB' in sizestring:
            sizenum = float(sizestring.replace('MB', ''))
            return sizenum
        else:
            return sizestring

    @staticmethod
    def host_name(server_name):
        return server_name

    @staticmethod
    def port_num(server_name):
        return server_name

    @staticmethod
    def getDBSpaceUsed(dbrows, servername, databasename):
        #quoted = urllib.quote_plus('DRIVER={FreeTDS};Server=my.db.server;Database=mydb;UID=myuser;PWD=mypwd;TDS_Version=8.0;Port=1433;')
        #sqlalchemy.create_engine('mssql+pyodbc:///?odbc_connect={}'.format(quoted))
        try:
            rowdict = next((item
                            for item in dbrows if item['server'] == servername
                            and item['database'] == databasename), None)
        except:
            rowdict = None

        if rowdict != None:
            return rowdict

        try:
            rowdict = {}
            rowdict.update({'server': servername, 'database': databasename})
            dbspace_database_space_sql = '''exec {0}..sp_spaceused '''

            #quoted = urllib.parse.quote_plus('DRIVER={FreeTDS};' + 'Server={0};Database={1};UID={2};PWD={3};TDS_Version=8.0;Port={4};'.format(servhostname , databasename, 'mra9895', 'PassWD', servport))
            #print (quoted)
            #engine = create_engine('sybase+pyodbc://mra9895:PassWD@{0}'.format(servername), connect_args={'autocommit': True})
            #engine = create_engine('sybase+pyodbc:///?odbc_connect={0}'.format(quoted),  connect_args={'autocommit': True})
            #mra9895:PassWD@{0}'.format(servername), connect_args={'autocommit': True})
            #engine = create_engine('sybase+pyodbc:///?odbc_connect={0}'.format(quoted),  connect_args={'autocommit': True})
            #engine = create_engine('sybase+pyodbc:///?odbc_connect={0}'.format(quoted))
            #"DSN=iims_oltp;"
            #            create_engine("mssql+pyodbc://scott:tiger@myhost:port/databasename?driver=SQL+Server+Native+Client+10.0")
            engine = create_engine(DBUtil.GetConnectionURL(
                servername, databasename),
                                   connect_args={'autocommit': True})

            #ase+pyodbc://mra9895:PassWD@iims-oltp-ip.mayo.edu:2031/iimdb_rch01_prod?driver=FreeTDS",
            #engine = create_engine(connect_url)
            connection = engine.connect().connection
            cursor = connection.cursor()

            print(dbspace_database_space_sql.format(databasename))
            cursor.execute(dbspace_database_space_sql.format(databasename))

            # Results set 1
            column_names = [col[0] for col in cursor.description
                            ]  # Get column names from MySQL

            for row in cursor.fetchall():
                rowdict.update({
                    name: DBUtil.getsizeinMB(row[i])
                    for i, name in enumerate(column_names)
                })

            # Results set 2
            cursor.nextset()
            column_names = [col[0] for col in cursor.description
                            ]  # Get column names from MySQL

            for row in cursor.fetchall():
                rowdict.update({
                    name: DBUtil.getsizeinMB(row[j])
                    for j, name in enumerate(column_names)
                })

            cursor.close()
            connection.close()
            dbrows.append(rowdict)

            return rowdict
        except Exception as e:
            print(e.args[1])
            return None

    @staticmethod
    def getDBSpaceChart(servername, databasename):

        try:
            dbdict = DBUtil.getDBSpaceUsed([], servername, databasename)
            engine = create_engine(DBUtil.GetConnectionURL(
                servername, databasename),
                                   connect_args={'autocommit': True})
            #engine = create_engine('sybase+pyodbc://mra9895:PassWD@{0}'.format(servername), connect_args={'autocommit': True})
            connection = engine.connect().connection
            cursor = connection.cursor()
            dbtables_sql = '''  select tablename = name from {0}..sysobjects where type = "U"  and name not like "%proxy%"  and name not like 'tmp%'  and len(name) < 30 '''
            cursor.execute(dbtables_sql.format(databasename))
            dbtables = []

            # Results set 1
            column_names = [col[0] for col in cursor.description
                            ]  # Get column names from MySQL

            for row in cursor.fetchall():
                tablerow = DBUtil.getTableSpaceUsed(dbtables, servername,
                                                    databasename, row[0], None,
                                                    None)

            cursor.close()
            connection.close()

            x_lables = [x['table'] for x in dbtables]
            x_lables.append('FreeSpace')

            y_values = [x['reserved'] for x in dbtables]
            y_values.append(dbdict['database_size'] - dbdict['reserved'])
            return (x_lables, y_values)

        except Exception as e:
            print(e.args[1])
            return None

    @staticmethod
    def getTableSpaceUsed(dbrows,
                          servername,
                          databasename,
                          tablename,
                          tbl_mindate=None,
                          tbl_maxdate=None):

        try:
            rowdict = next((item
                            for item in dbrows if item['server'] == servername
                            and item['database'] == databasename)
                           and item['table'] == tablename, None)
        except:
            rowdict = None

        if rowdict != None:
            return rowdict

        try:
            rowdict = {}
            rowdict.update({
                'server': servername,
                'database': databasename,
                'table': tablename
            })
            dbspace_table_daterage_sql = ""

            if tbl_maxdate == None or len(tbl_maxdate) < 3:
                dbspace_table_daterage_sql = dbspace_table_daterage_sql + " select @max_row_date = getdate() "
            else:
                dbspace_table_daterage_sql = dbspace_table_daterage_sql + " select @max_row_date = " + tbl_maxdate
            if tbl_mindate == None or len(tbl_mindate) < 3:
                dbspace_table_daterage_sql = dbspace_table_daterage_sql + " select @min_row_date = dateadd(dd, -30, @max_row_date ) "
            else:
                dbspace_table_daterage_sql = dbspace_table_daterage_sql + " select @min_row_date = " + tbl_mindate

            dbspace_table_daterage_sql = dbspace_table_daterage_sql + " select startDt = @min_row_date, endDt = @max_row_date, sizedays = datediff(dd, @min_row_date, @max_row_date) "

            dbspace_table_space_sql = '''
                set nocount on
                exec {0}..sp_spaceused {1}
                declare @min_row_date datetime, @max_row_date datetime  ''' + dbspace_table_daterage_sql

            engine = create_engine(DBUtil.GetConnectionURL(
                servername, databasename),
                                   connect_args={'autocommit': True})
            #engine = create_engine('sybase+pyodbc://mra9895:PassWD@{0}'.format(servername), connect_args={'autocommit': True})
            connection = engine.connect().connection
            cursor = connection.cursor()

            cursor.execute(
                dbspace_table_space_sql.format(databasename, tablename))

            # Results set 1
            column_names = [col[0] for col in cursor.description
                            ]  # Get column names from MySQL

            for row in cursor.fetchall():
                rowdict.update({
                    name: DBUtil.getsizeinMB(row[i])
                    for i, name in enumerate(column_names)
                })

            # Results set 2
            cursor.nextset()
            column_names = [col[0] for col in cursor.description
                            ]  # Get column names from MySQL

            for row in cursor.fetchall():
                rowdict.update({
                    name: DBUtil.getsizeinMB(row[j])
                    for j, name in enumerate(column_names)
                })

            cursor.close()
            connection.close()
            dbrows.append(rowdict)
            return rowdict
        except Exception as e:
            print(e.args[1])
            return None


def main():

    parser = argparse.ArgumentParser(
        description="Python Local OS Commands Runner")
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-v", "--verbose", action="store_true")
    group.add_argument("-q", "--quiet", action="store_true")
    parser.add_argument("-cmd", help="command_to_run")
    parser.add_argument("-a", "--arg", help="args", default=None)
    parser.add_argument("-dbserv", help="args", default=None)
    parser.add_argument("-sql", "--arg", help="args", default=None)
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

        if command.strip() == 'getdb':
            #createStackFile("api/")
            getdbinfo(dbserver, sqltext)

            sys.exit(0)

        if command.strip() == 'iocmreprocess':
            #createStackFile("api/")
            getdbinfo("iimsProd", getIOCMReprocessSQL())

            sys.exit(0)

        if command.strip() == 'parse':
            filepath = arguments  #"42_19780259-1_1.2.840.113717.2.19780259.1_1.3.6.1.4.1.25403.1322.6188.20120314113107.1717.2.19780259.1.img"
            #createStackFile("api/")
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
