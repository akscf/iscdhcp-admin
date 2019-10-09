<p align="center"><b>A simple web interface and web services for ISC DHCPD</b></p><br>
<p align="center">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s0.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s1.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s2.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s3.png">
</p>

------------------------
Changes log:<br>
<b>9.10.2019</b> [isc-dhcp-manager-1.0.0-09102019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-09102019.tar.gz/download)<br>
    * fexed bugs in UI<br>
    + added leases management functions: add/update/delete/get<br>
    
<b>26.09.2019</b> [isc-dhcp-manager-1.0.0-26092019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-26092019.tar.gz/download)  
    * fixed some bugs in UI (language change)<br>
    * fixed some bugs in backend (config)<br>
    + viewer UI<br>

<b>17.05.2019</b> [isc-dhcp-manager-1.0.0-17052019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-17052019/download)<br>
    initial version<br>
    
    
------------------------
1. Installation<br>
   [Download latest version](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/)<br>
   Unpack the archive to /opt (you should get the following: /opt/dhcp-mgr).<br>
   <br>
   Configurations:<br>
    manager settings......: /opt/dhcp-mgr/configs/dhcpmgr.conf<br>
    web server settings...: /opt/dhcp-mgr/configs/wsp.conf<br>
    logger settings.......: /opt/dhcp-mgr/configs/log4perl.conf<br>

2. Starting<br>
   auto-start:<br>
     copy /opt/dhcp-mgr/dhcp-mgr -> /etc/init.d/<br>
     and run: update-rc.d dhcp-mgr defaults<br>
   <br>
   testing:<br>
    /opt/dhcp-mgr/wsp-run.sh start<br>
    ctrl+c for stop

3. Web access<br>
   By default, the web console available here: http://127.0.0.1:8080/.<br>
   There are 2 roles: admin (it's a maximum privileged role, that gives access to the following functions: edit configs/leases, view logs and manage a dhcp server),<br>
   viewer (role gives access only to search/view functions by the leases base).<br>
   Credentials: admin:secret / viewer:secret<br>
   <br>
   You can change it here:  /opt/dhcp-mgr/configs/dhcpmgr.conf

------------------------
Web services:<br>

  * DhcpServerManagementService<br>
     - <b>serverStart()</b><br>
       restart the DHCP daemon<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverStart", "params":null}'</i><br>
       
     - <b>serverStop()</b><br>
       stop the DHCP daemon<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverStop", "params":null}'</i><br>
       
     - <b>serverReload()</b><br>
       reload the DHCP daemon (apply a new configuration and clean leases base)<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverReload", "params":null}'</i><br>
       
     - <b>serverGetStatus()</b><br>
       get the dhcpd version and status<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverGetStatus", "params":null}'</i><br>
       
     - <b>configRead()</b><br>
       read DHCP daemon configuration<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"configRead", "params":null}'</i><br>
       
     - <b>configWrite(text)</b><br>
       write/update the DHCP daemon configuration<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"configWrite", "params":"--- config text ---"}'</i><br>
       
     - <b>listenInterfacesGet()</b><br>
       show availble intrfaces<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"listenInterfacesGet", "params":null}'</i><br>
       
     - <b>listenInterfacesSet(text)</b><br>
     	not yet implemented<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"listenInterfacesSet", "params":["eth0, eth1"]}'</i><br>
      
     - <b>logRead(filter, settings)</b><br>
     	read last lines from syslog (just only read, the search function not yet implemented)<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"logRead", "params":["error", null]}'</i><br>

  * LeasesManagementService<br>
      - <b>search(filter, settings)</b><br>
     	search a lease into db by ip or mac<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"search", "params":["192.168.1", null]}'</i><br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"search", "params":["00:0e:08", null]}'</i><br>
      
      - <b>get(mac)</b><br>
        lookup object by mac (lease / host)<br>
        <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"get", "params":["00:0e:08:01:01:01"]}'</i><br>
        
     - <b>add(entity)</b><br>
     	create a new host object (see details here: DHCPMGR::Models::LeaseEntry)<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"add", "params":[{"class":"DHCPMGR.Models.LeaseEntry", "type":"host", "name":"test2", "ip":"192.168.1.2", "mac":"00:0e:08:01:01:01", "state":null,"startTime":null,"endTime":null}}'</i><br>
      
     - <b>update(entity)</b><br>
     	update an exists lease object<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"update", "params":[{"class":"DHCPMGR.Models.LeaseEntry", "type":"host", "name":"test2", "ip":"192.168.11.22", "mac":"00:0e:08:01:01:01", "state":null,"startTime":null,"endTime":null}}'</i><br>
      
     - <b>delete(mac)</b><br>
        delete an exists lease object (only for host)<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"delete", "params":["00:0e:08:01:01:01"}'</i><br>
      
      
