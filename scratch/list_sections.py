import sys
sys.stdout.reconfigure(encoding='utf-8')
with open('App.jsx', encoding='utf-8', errors='ignore') as f:
    for i, l in enumerate(f):
        s = l.strip()
        if s.startswith('<') and any(k in s for k in ['Section', 'Album', 'Header', 'Footer', 'Dvd', 'BeTheGroove', 'Setlist', 'Budokan', 'MainLive', 'id=']):
            print(f"{i+1}: {s}")
