<b>A simple web interface and web services for ISC DHCPD</b><br>

<p align="center">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s0.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s1.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s2.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/sshots/s3.png">
</p>

------------------------
Changes log:
<br>
9.10.2019 [isc-dhcp-manager-1.0.0-09102019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-09102019.tar.gz/download)
    * fexed bugs in UI<br>
    + added leases management functions: add/update/delete/get<br>
    <br><br>
    
26.09.2019 [isc-dhcp-manager-1.0.0-26092019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-26092019.tar.gz/download)  
    * fixed some bugs in UI (language change)<br>
    * fixed some bugs in backend (config)<br>
    + viewer UI<br>
    <br><br>

    17.05.2019 [isc-dhcp-manager-1.0.0-17052019](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/isc-dhcp-manager-1.0.0-17052019/download)<br>
    initial version<br>
    <br><br>
    
------------------------
1. Installation<br>
   [Download latest version](https://sourceforge.net/projects/cfdisfiles/files/isc-dhcp-manager/)<br>
   Unpack the archive to /opt (you should get the following: /opt/dhcp-mgr).<br>
   <br>
   Configurations:<br>
    manager settings......: /opt/dhcp-mgr/configs/dhcpmgr.conf<br>
    web server settings...: /opt/dhcp-mgr/configs/wsp.conf<br>
    logger settings.......: /opt/dhcp-mgr/configs/log4perl.conf<br>
<br>
<br>
2. Starting<br>
   auto-start:<br>
     copy /opt/dhcp-mgr/dhcp-mgr -> /etc/init.d/<br>
     and run: update-rc.d dhcp-mgr defaults<br>
   <br>
   testing:<br>
    /opt/dhcp-mgr/wsp-run.sh start<br>
    ctrl+c for stop
<br>
<br>
3. Web access<br>
   By default, the web console available here: http://127.0.0.1:8080/.<br>
   There are 2 roles: admin (it's a maximum privileged role, that gives access to the following functions: edit configs/leases, view logs and manage a dhcp server),<br>
   viewer (role gives access only to search/view functions by the leases base).<br>
   Credentials: admin:secret / viewer:secret<br>
   <br>
   You can change it here:  /opt/dhcp-mgr/configs/dhcpmgr.conf
<br>
<br>
<br>
------------------------
Web services:<br>  
<br>
  * DhcpServerManagementService<br>
     - <b>serverStart()</b><br>
       restart the DHCP daemon<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverStart", "params":null}'<br>  
       <br>
     - <b>serverStop()</b><br>
       stop the DHCP daemon<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverStop", "params":null}'<br>
       <br>
     - <b>serverReload()</b><br>
       reload the DHCP daemon (apply a new configuration and clean leases base)<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverReload", "params":null}'<br>
       <br>
     - <b>serverGetStatus()</b><br>
       get the dhcpd version and status<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverGetStatus", "params":null}'<br>
       <br>       
     - <b>configRead()</b><br>
       read DHCP daemon configuration<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"configRead", "params":null}'<br>
       <br>
     - <b>configWrite(text)</b><br>  
       write/update the DHCP daemon configuration<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"configWrite", "params":"--- config text ---"}'<br>
       <br>
     - <b>listenInterfacesGet()</b><br>
       show availble intrfaces<br>
       example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"listenInterfacesGet", "params":null}'<br>
       <br>
     - <b>listenInterfacesSet(text)</b><br>
     	not yes implemented<br>
     	example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"listenInterfacesSet", "params":["eth0, eth1"]}'<br>
     	<br>
     - <b>logRead(filter, settings)</b><br>
     	read last lines from syslog (just only read, the search function not yet implemented)<br>
     	example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"logRead", "params":["error", null]}'<br>
<br>
  * LeasesManagementService  
     - <b>search(filter, settings)</b><br>
     	search a lease into db by ip or mac<br>
     	example1: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"search", "params":["192.168.1", null]}'<br>
     	example2: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"search", "params":["00:0e:08", null]}'<br>
     	<br>
     - <b>get(mac)</b><br>
        lookup object by mac (lease / host)<br>
        example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"get", "params":["00:0e:08:01:01:01"]}'<br>
        <br>
     - <b>add(entity)</b><br>
     	create a new host object (see details here: DHCPMGR::Models::LeaseEntry)<br>
     	example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"add", "params":[{"class":"DHCPMGR.Models.LeaseEntry", "type":"host", "name":"test2", "ip":"192.168.1.2", "mac":"00:0e:08:01:01:01", "state":null,"startTime":null,"endTime":null}}'<br>
     	<br>
     - <b>update(entity)</b><br>
     	update an exists lease object<br>
     	example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"update", "params":[{"class":"DHCPMGR.Models.LeaseEntry", "type":"host", "name":"test2", "ip":"192.168.11.22", "mac":"00:0e:08:01:01:01", "state":null,"startTime":null,"endTime":null}}'<br>
     	<br>
     - <b>delete(mac)</b><br>
        delete an exists lease object (only for host)<br>
     	example: curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"delete", "params":["00:0e:08:01:01:01"}'<br>
     	<br>
<br>