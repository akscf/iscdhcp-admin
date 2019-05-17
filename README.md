Simple web interface and json-rpc services for ISC DHCP Serevr written in Perl.  

Basic features:  
 - control the server (start/stop/reload/etc)
 - manager the configuration
 - view leases (*)
 - OMAPI services (*)


------------------------
Screenshots:  
<p align="center">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss0.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss1.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss2.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss3.png">
</p>

------------------------
1. Installtion and setup   
   Download the latest version: [isc-dhcp-manager-1.0.0-17052019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-17052019.tar.gz/download)  
   Unpack isc-dhcp-manager-x.x..tar.gz to /opt
 
   The configurations:  
    manager settings......: /opt/dhcp-mgr/configs/dhcpmgr.conf  
    web server settings...: /opt/dhcp-mgr/configs/wsp.conf  
    logger settings.......: /opt/dhcp-mgr/configs/log4perl.conf  

   
2. Starting  
   auto-start:  
     copy /opt/dhcp-mgr/dhcp-mgr /etc/init.d/ and run: update-rc.d dhcp-mgr defaults

   testng:  
    /opt/dhcp-mgr/wsp-run.sh start
    ctrl+c for stop


3. API  
 
  * DhcpServerManagementService  
     - serverStart  
     - serverStop  
     - serverReload  
     - serverGetStatus  
     - configRead  
     - configWrite  
     - listenInterfacesGet  
     - listenInterfacesSet  
     - logRead  


  * LeasesManagementService
     - search

