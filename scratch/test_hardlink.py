import os, urllib.request, subprocess

os.makedirs('nri-landlord-tenant-eviction', exist_ok=True)
dest = os.path.join('nri-landlord-tenant-eviction', 'index.html')
if not os.path.exists(dest):
    subprocess.check_call(f'cmd /c mklink /H "{dest}" "nri-landlord-tenant-eviction.html"', shell=True)

try:
    res = urllib.request.urlopen('http://127.0.0.1:5501/nri-landlord-tenant-eviction/')
    print('Port 5501 status for /nri-landlord-tenant-eviction/:', res.status)
    content = res.read().decode('utf-8', errors='ignore')
    print('Title in response:', content[content.find('<title>'):content.find('</title>')+8])
    
    res2 = urllib.request.urlopen('http://127.0.0.1:5501/nri-landlord-tenant-eviction')
    print('Port 5501 status for /nri-landlord-tenant-eviction:', res2.status)
except Exception as e:
    print('Error:', e)

