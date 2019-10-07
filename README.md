<b>Simple web interface and json-rpc services for ISC DHCP Serevr.</b>  

<p align="center">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss0.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss1.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss2.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/ss3.png">
</p>

------------------------
Changes log:  

26.09.2019 [isc-dhcp-manager-1.0.0-26092019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-26092019.tar.gz/download)  
    * fixed some bugs in UI (language change)  
    * fixed some bugs in backend (config)  
    + viewer UI  


17.05.2019 [isc-dhcp-manager-1.0.0-17052019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-17052019/download)  
    initial version  


------------------------
1. Installation  
   [Download latest version](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/)  
   Unpack the archive to /opt (you should get the following: /opt/dhcp-mgr).  
 
   Configurations:  
    manager settings......: /opt/dhcp-mgr/configs/dhcpmgr.conf  
    web server settings...: /opt/dhcp-mgr/configs/wsp.conf  
    logger settings.......: /opt/dhcp-mgr/configs/log4perl.conf  

   
2. Starting  
   auto-start:  
     copy /opt/dhcp-mgr/dhcp-mgr -> /etc/init.d/   
     and run: update-rc.d dhcp-mgr defaults

   testing:  
    /opt/dhcp-mgr/wsp-run.sh start
    ctrl+c for stop

3. Web access  
   By default, the web console available here: http://127.0.0.1:8080/.  
   There are 2 roles: admin (it's a maximum privileged role, that gives access to the following functions: edit configs/leases, view logs and manage a dhcp server), 
   viewer (role gives access only to search/view functions by the leases base).  
   Credentials: admin:secret / viewer:secret

   You can change it here:  /opt/dhcp-mgr/configs/dhcpmgr.conf


------------------------
Web services (json-rpc, http://127.0.0.1:8080/rpc ):  

  * DhcpServerManagementService  
     serverStart  
     serverStop  
     serverReload  
     serverGetStatus  
     configRead  
     configWrite  
     listenInterfacesGet  
     listenInterfacesSet  
     logRead  


  * LeasesManagementService  
     search

  * OmapiService
