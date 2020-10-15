<p align="center"><b>A simple web interface for ISC DHCPD</b></p><br>
<p align="center">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/bin/s0.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/bin/s1.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/bin/s2.png">
 <img width="320" height="200" src="https://github.com/akscf/isc-dhcp-manager/blob/master/bin/s3.png">
</p>

------------------------
Changes log:<br>
<b>15.10.2020</b> [dhcpadm_1_0_15102020.tar.gz](https://github.com/akscf/isc-dhcp-manager/blob/master/bin/dhcpadm_1_0_15102020.tar.gz)<br>
    * web-ui updated<br>
    * backend updated<br>

<b>9.10.2019</b>
    * fexed bugs in UI<br>
    + added leases management functions: add/update/delete/get<br>
    
<b>26.09.2019</b>
    * fixed some bugs in UI (language change)<br>
    * fixed some bugs in backend (config)<br>
    + viewer UI<br>

<b>17.05.2019</b>
    initial version<br>
    

Installation<br>
 1. Latest build: [dhcpadm_1_0_15102020.tar.gz](https://github.com/akscf/isc-dhcp-manager/blob/master/bin/dhcpadm_1_0_15102020.tar.gz)<br>
 2. Home dir should be '/opt/dhcpadm' (unpack archive and move content into /opt)<br>
 3. Edit configutations (/optdhcpadm/configs/)<br>
    set your ip's, omapi key and so on
 4. start/stop a service: /opt/dhcpadm/dhcp-mgr [start | stop]<br>
    or copy it to /etc/init.d/<br>

 5. web-ui (default admin password: secret)<br>
    http://127.0.0.1:8080/<br>


Web services:<br>

  * DhcpServerManagementService<br>
     - <b>serverStart()</b><br>
       restart DHCP daemon<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverStart", "params":null}'</i><br>
       
     - <b>serverStop()</b><br>
       stop DHCP daemon<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverStop", "params":null}'</i><br>
       
     - <b>serverReload()</b><br>
       reload DHCP daemon (apply a new configuration and clean leases base)<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverReload", "params":null}'</i><br>
       
     - <b>serverGetStatus()</b><br>
       get dhcpd status<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"serverGetStatus", "params":null}'</i><br>
       
     - <b>configRead()</b><br>
       read server configuration<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"configRead", "params":null}'</i><br>
       
     - <b>configWrite(text)</b><br>
       update server configuration<br>
       <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"configWrite", "params":"config data"}'</i><br>
       
     - <b>logRead(filter)</b><br>
        show syslod 
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"DhcpServerManagementService", "method":"logRead", "params":null}'</i><br>

  * LeasesManagementService<br>
      - <b>explore(filter)</b><br>
     	search a lease by ip or mac<br>
	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"explore", "params":null}'</i><br>      

      - <b>get(mac)</b><br>
        lookup object by mac (lease / host)<br>
        <i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"get", "params":["00:0e:08:01:01:01"]}'</i><br>
        
     - <b>add(entity)</b><br>
     	create a new host object (see details here: DHCPMGR::Models::LeaseEntry)<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"add", "params":[{"class":"DHCPMGR.Models.LeaseEntry", "type":"host", "name":"test2", "ip":"192.168.1.2", "mac":"00:0e:08:01:01:01", "state":null,"startTime":null,"endTime":null}}'</i><br>
      
     - <b>update(entity)</b><br>
	omapi update doesn't work correctly, use delete and create a new object
      
     - <b>delete(mac)</b><br>
        delete an exists lease object (only for host)<br>
     	<i>#curl -u admin:secret -X POST -H "Content-Type: application/json" http://127.0.0.1:8080/rpc/ -d '{"id":1, "service":"LeasesManagementService", "method":"delete", "params":["00:0e:08:01:01:01"}'</i><br>
      
      
