CIGA Release status and Timeline

1. Wait for CIG imaging common library & SAN Changes to be checked-in to master (15.0 version)
   a. Regression Testing (This week - Liqin).  
   b. Load Testing (for Receiving and Processing only ) in Test Environment ( Week of Feb 1st)  
   c. Deploy to CIGA Staging on two production hosts.
   Redirect Production Prefetch to CIGA Staging with new code (Week of Feb 8th)
   d. Deploy CIGA 15.0 to production on all hosts (Week of Feb 15th)

2. Refactor ICOM branch to be after 15.0
   a. Wait until CIGA master has 15.0 code (potential to start feb 8th)
   b. Pull new master to iocm_branch and refactor
   c. Wait for 15.0 to be in production and checkin iocm-branch to master as CIGA 16.0
   d. Integration test CIGA 16.0 in windows and AIX
   e. Regression test 16.0
   f. Release to Staging. Keep in staging for 1 week. a) Send production IOCM cases to staging and validate
   g. Release to production (Some time in March??)
   ? JPEG bug fix
