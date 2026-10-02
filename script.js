document.addEventListener("DOMContentLoaded", function() {
    
    // Data Struktur Gitar beserta Link Sumber Eksternal (Learn More)
    const G = [
        {
            k: 'akustik', 
            n: 'Akustik', 
            s: 'Bersuara dari kayunya sendiri (Zacky Vengeance)', 
            t: 'Badan berongga dan lubang suara memperkuat getaran senar secara alami. Tanpa kabel, tanpa amplifier, cukup untuk mengiringi nyanyian di ruang mana pun.', 
            r: [['Senar', '6, baja atau nilon'], ['Nada', 'Hangat dan penuh'], ['Genre', 'Folk, pop akustik, country']], 
            d: 'foto detail lubang suara',
            img: 'zaky.jpg',
            detailImg: 'zaky.jpg',
            link: 'https://id.wikipedia.org/wiki/Gitar_akustik' // Link sumber web lain
        },
        {
            k: 'listrik', 
            n: 'Listrik', 
            s: 'Suaranya dibentuk pickup dan amplifier (Synyster Gates)', 
            t: 'Badan padat nyaris tidak bergema sendiri. Pickup menangkap getaran senar, lalu amplifier dan efek mengubahnya dari jernih hingga menggeram.', 
            r: [['Senar', '6, baja tipis'], ['Nada', 'Jernih hingga distorsi'], ['Genre', 'Rock, blues, jazz, metal']], 
            d: 'foto detail pickup',
            img: 'syn.jpg',
            detailImg: 'syn.jpg',
            link: 'https://id.wikipedia.org/wiki/Gitar_listrik' // Link sumber web lain
        },
        {
            k: 'bass', 
            n: 'Bass', 
            s: 'Fondasi ritme dan harmoni (Johnny Christ)', 
            t: 'Leher panjang dan senar tebal menghasilkan nada rendah yang menyatukan drum dengan gitar dan vokal. Sering tak disadari, tetapi langsung terasa bila hilang.', 
            r: [['Senar', '4, kadang 5 atau 6'], ['Nada', 'Dalam dan bulat'], ['Genre', 'Funk, rock, jazz, reggae']], 
            d: 'foto detail leher bass',
            img: 'jony.jpg',
            detailImg: 'jony.jpg',
            link: 'https://id.wikipedia.org/wiki/Gitar_bas' // Link sumber web lain
        }
    ];

    const ld = (id, defaultImg) => {
        try { 
            let val = localStorage.getItem('gf:' + id);
            if (!val || val === "null") return defaultImg;
            return val;
        } catch(e) { 
            return defaultImg; 
        }
    };

    const sv = (id, u) => {
        try { 
            localStorage.setItem('gf:' + id, u); 
        } catch(e) {}
    };

    function fit(file, cb) {
        const r = new FileReader();
        r.onload = () => {
            const i = new Image();
            i.onload = () => {
                const s = Math.min(1, 1400 / Math.max(i.width, i.height));
                const c = document.createElement('canvas');
                c.width = i.width * s;
                c.height = i.height * s;
                c.getContext('2d').drawImage(i, 0, 0, c.width, c.height);
                cb(c.toDataURL('image/jpeg', .8));
            };
            i.src = r.result;
        };
        r.readAsDataURL(file);
    }

    function pick(id, host, label) {
        const f = document.createElement('input');
        f.type = 'file';
        f.accept = 'image/*';
        f.onchange = () => f.files[0] && fit(f.files[0], u => {
            paint(host, u, label);
            sv(id, u);
        });
        f.click();
    }

    function paint(host, u, label) {
        host.querySelectorAll('img,.ph').forEach(e => e.remove());
        if (u) {
            const i = new Image();
            i.alt = label;
            i.src = u;
            host.prepend(i);
        } else {
            const d = document.createElement('div');
            d.className = 'ph';
            d.innerHTML = `<div><svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 10l6-6M18 3l3 3M11.5 12.5a3 3 0 0 0-3.4.4c-1 .9-.6 2.3-1.7 3.2-1.4 1.1-3.9.3-3.9 2.6 0 1.8 1.7 3.3 3.6 3.3 2.7 0 3.9-1.6 4.9-2.7 1-1.1 2.6-1.1 3-2.8.3-1.4-.3-2.3-1.2-3.1z"/></svg><br>Tambahkan ${label}</div>`;
            host.prepend(d);
        }
    }

    // Galeri Akordeon Atas
    const acc = document.getElementById('acc');
    if (acc) {
        G.forEach((g, i) => {
            const p = document.createElement('div');
            p.className = 'p' + (i ? '' : ' on');
            p.tabIndex = 0;
            p.setAttribute('role', 'button');
            p.setAttribute('aria-expanded', !i);
            p.innerHTML = `<button class="up" type="button"></button><div class="cap"><h2>${g.n}</h2><p>${g.s}</p></div>`;
            
            paint(p, ld(g.k + '-hero', g.img), 'foto gitar ' + g.n.toLowerCase());
            
            const open = () => {
                acc.querySelectorAll('.p').forEach(x => {
                    x.classList.toggle('on', x === p);
                    x.setAttribute('aria-expanded', x === p);
                });
            };
            
            p.onclick = open;
            p.onkeydown = e => {
                if ((e.key == 'Enter' || e.key == ' ') && e.target === p) {
                    e.preventDefault();
                    open();
                }
            };
            
            p.querySelector('.up').onclick = e => {
                e.stopPropagation();
                open();
                pick(g.k + '-hero', p, 'foto gitar ' + g.n.toLowerCase());
            };
            
            acc.append(p);
        });
    }

    // BAGIAN INI YANG DITAMBAHKAN: Bagian Detail Bawah + Tombol Learn More
    const chs = document.getElementById('chs');
    if (chs) {
        G.forEach(g => {
            const s = document.createElement('section');
            s.className = 'ch';
            
            // Menyisipkan tombol Learn More di bawah daftar spesifikasi (<dl>)
            s.innerHTML = `
                <button class="slot" type="button" aria-label="Ganti ${g.d}"></button>
                <div>
                    <h3>${g.n}</h3>
                    <p>${g.t}</p>
                    <dl>${g.r.map(x => `<dt>${x[0]}</dt><dd>${x[1]}</dd>`).join('')}</dl>
                    <div class="learn-more-wrap">
                        <a href="${g.link}" target="_blank" class="learn-more-btn">Learn More &rarr;</a>
                    </div>
                </div>`;
            
            const b = s.querySelector('.slot');
            paint(b, ld(g.k + '-detail', g.detailImg), g.d);
            b.onclick = () => pick(g.k + '-detail', b, g.d);
            chs.append(s);
        });
    }

    // Interaksi Formulir Pertanyaan (Tanpa Refresh Halaman)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            const namaInput = document.getElementById('nama');
            const nama = namaInput ? namaInput.value : 'Pengunjung';
            alert(`Terima kasih, ${nama}! Pesan atau pertanyaan Anda berhasil dikirim.`);
            contactForm.reset();
        });
    }
});

// --- KONTROL MUSIK INTERAKTIF ---
function toggleAudio() {
    const music = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playPauseBtn');
    const statusText = document.getElementById('statusText');

    if (music.paused) {
        music.play().then(() => {
            playBtn.textContent = '⏸';
            statusText.textContent = 'Sedang Berputar...';
            playBtn.style.backgroundColor = '#e05a26'; // Berubah jadi warna aksen saat menyala
        }).catch(err => {
            console.log("Gagal memutar audio:", err);
        });
    } else {
        music.pause();
        playBtn.textContent = '▶';
        statusText.textContent = 'Dijeda';
        playBtn.style.backgroundColor = '#66fcf1';
    }
}