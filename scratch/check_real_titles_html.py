import urllib.request, sys
sys.stdout.reconfigure(encoding='utf-8')
html = urllib.request.urlopen('https://sirup.online/5th/').read().decode('utf-8')
i = html.find('header-about')
j = html.find('header-roots')
print("=== ABOUT ===")
print(html[i:j])
print("=== ROOTS ===")
print(html[j:j+2000])
