Simple web interface and json-rpc services for ISC DHCP Serevr written in Perl.  

Basic features:  
 - control the server (start/stop/reload/etc)
 - manager the configuration
 - view leases (*)
 - OMAPI services (*)


------------------------
Screenshots:  
![alt text](https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss1.png)
![alt text](https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss3.png)

------------------------
1. Installtion and setup   
   Download a last version: 
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

