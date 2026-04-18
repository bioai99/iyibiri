'use client'
import { useEffect, useRef } from 'react'
import Link from 'next/link'
import type * as THREE_NS from 'three'

export default function LandingPage() {
  const threeCanvasRef = useRef<HTMLCanvasElement>(null)
  const heroCanvasRef = useRef<HTMLCanvasElement>(null)
  const networkCanvasRef = useRef<HTMLCanvasElement>(null)
  const feedTrackRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const liveCountRef = useRef<HTMLSpanElement>(null)
  const tokenStageRef = useRef<HTMLDivElement>(null)

  // ══════════════ THREE.JS 3D KARMA TOKEN ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return
    const canvas = threeCanvasRef.current
    if (!canvas) return

    let animId: number
    let disposed = false

    const initThree = async () => {
      const THREE = await import('three')

      const parent = canvas.parentElement
      if (!parent || disposed) return
      const W = parent.offsetWidth
      const H = parent.offsetHeight
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100)
      camera.position.z = 5
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(W, H)

      // Coin (cylinder)
      const coinGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.14, 64, 1)
      const coinMat = new THREE.MeshStandardMaterial({ color: 0xE8C268, metalness: 0.95, roughness: 0.22, emissive: 0x3a2a0e, emissiveIntensity: 0.25 })
      const coin = new THREE.Mesh(coinGeom, coinMat)
      coin.rotation.x = Math.PI / 2
      scene.add(coin)

      // Inner ring (groove)
      const ringGeom = new THREE.TorusGeometry(0.9, 0.015, 16, 64)
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x8a6a2c, metalness: 0.9, roughness: 0.3 })
      const ring1 = new THREE.Mesh(ringGeom, ringMat); ring1.position.z = 0.072; coin.add(ring1)
      const ring2 = new THREE.Mesh(ringGeom, ringMat); ring2.position.z = -0.072; coin.add(ring2)

      // Lights
      const amb = new THREE.AmbientLight(0xffffff, 0.35); scene.add(amb)
      const key = new THREE.DirectionalLight(0xfff4d0, 1.8); key.position.set(3, 4, 5); scene.add(key)
      const rim = new THREE.DirectionalLight(0xE8C268, 1.2); rim.position.set(-3, -2, -2); scene.add(rim)
      const point = new THREE.PointLight(0xF4D98A, 0.8, 10); point.position.set(0, 0, 3); scene.add(point)

      // Satellite tokens
      const sats: THREE_NS.Mesh[] = []
      for (let i = 0; i < 6; i++) {
        const s = new THREE.Mesh(
          new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32),
          new THREE.MeshStandardMaterial({ color: 0xE8C268, metalness: 0.9, roughness: 0.3, emissive: 0x2a1f08, emissiveIntensity: 0.3 })
        )
        s.rotation.x = Math.PI / 2
        s.userData = { angle: i * (Math.PI * 2 / 6), radius: 2.2, speed: 0.008 + Math.random() * 0.006, vOff: Math.random() * Math.PI * 2 }
        scene.add(s)
        sats.push(s)
      }

      let mouseX = 0, mouseY = 0, targetRX = 0, targetRY = 0

      const onMouseMove = (e: MouseEvent) => {
        const rect = parent.getBoundingClientRect()
        if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
          mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
          mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
        }
      }
      window.addEventListener('mousemove', onMouseMove)

      let t = 0
      function animate() {
        if (disposed) return
        animId = requestAnimationFrame(animate)
        t += 0.016
        targetRX += ((-mouseY * 0.3) - targetRX) * 0.05
        targetRY += ((mouseX * 0.5) + t * 0.3 - targetRY) * 0.05
        coin.rotation.x = Math.PI / 2 + targetRX
        coin.rotation.z = targetRY

        sats.forEach(s => {
          s.userData.angle += s.userData.speed
          s.position.x = Math.cos(s.userData.angle) * s.userData.radius
          s.position.y = Math.sin(s.userData.angle) * s.userData.radius * 0.6
          s.position.z = Math.sin(s.userData.angle + s.userData.vOff) * 0.4
          s.rotation.z += 0.02
        })

        renderer.render(scene, camera)
      }
      animate()

      const onResize = () => {
        if (!parent || disposed) return
        const W2 = parent.offsetWidth, H2 = parent.offsetHeight
        camera.aspect = W2 / H2; camera.updateProjectionMatrix()
        renderer.setSize(W2, H2)
      }
      window.addEventListener('resize', onResize)

      // Store cleanup references
      ;(canvas as any)._threeCleanup = () => {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(animId)
        renderer.dispose()
        coinGeom.dispose()
        coinMat.dispose()
        ringGeom.dispose()
        ringMat.dispose()
        sats.forEach(s => {
          (s.geometry as THREE_NS.BufferGeometry).dispose()
          ;(s.material as THREE_NS.Material).dispose()
        })
      }
    }

    initThree()

    return () => {
      disposed = true
      cancelAnimationFrame(animId)
      if ((canvas as any)._threeCleanup) {
        (canvas as any)._threeCleanup()
      }
    }
  }, [])

  // ══════════════ GSAP EFFECTS ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return

    let scrollTriggers: any[] = []

    const initGsap = async () => {
      const gsapModule = await import('gsap')
      const gsap = (gsapModule.default || gsapModule) as any
      const scrollTriggerModule = await import('gsap/ScrollTrigger')
      const ScrollTrigger = (scrollTriggerModule as any).ScrollTrigger || (scrollTriggerModule as any).default
      gsap.registerPlugin(ScrollTrigger)

      // Hero text intro
      gsap.to('.word', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15, delay: 0.2 })
      gsap.to('.lead', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.6 })
      gsap.to('.cta-row', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 })
      gsap.to('.hero-meta', { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1 })

      // Scroll-pinned story
      const steps = document.querySelectorAll('.story-text')
      const layers = document.querySelectorAll('.story-screen-layer')
      const dots = document.querySelectorAll('.story-progress .dot')

      function setStep(i: number) {
        steps.forEach((s, j) => gsap.to(s, { opacity: j === i ? 1 : 0, duration: 0.5, ease: 'power2.out' }))
        layers.forEach((l, j) => gsap.to(l, { opacity: j === i ? 1 : 0, duration: 0.5, ease: 'power2.out' }))
        dots.forEach((d, j) => d.classList.toggle('active', j === i))
      }
      setStep(0)

      const st1 = ScrollTrigger.create({
        trigger: '.story-pin',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate(self: any) {
          const i = Math.min(3, Math.floor(self.progress * 4))
          setStep(i)
        }
      })
      scrollTriggers.push(st1)

      // Count up
      document.querySelectorAll('[data-cu]').forEach(el => {
        const target = parseInt((el as HTMLElement).dataset.cu || '0', 10)
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          once: true,
          onEnter() {
            const obj = { v: 0 }
            gsap.to(obj, {
              v: target, duration: 2.2, ease: 'power2.out',
              onUpdate() { (el as HTMLElement).textContent = Math.floor(obj.v).toLocaleString('tr-TR') }
            })
          }
        })
        scrollTriggers.push(st)
      })
    }

    initGsap()

    return () => {
      scrollTriggers.forEach(st => st.kill && st.kill())
    }
  }, [])

  // ══════════════ HERO BG — CANVAS PARTICLES ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return
    const c = heroCanvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let w: number = 800, h: number = 600
    let animId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; o: number }[] = []

    function resize() {
      const parent = c!.parentElement
      if (!parent) return
      w = c!.width = parent.offsetWidth
      h = c!.height = parent.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * (w || 800),
        y: Math.random() * (h || 600),
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.5 + 0.1
      })
    }

    function tick() {
      ctx!.clearRect(0, 0, w, h)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx!.beginPath(); ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(232,194,104,${p.o})`; ctx!.fill()
      })
      // connect near
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 120) {
            ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y)
            ctx!.strokeStyle = `rgba(232,194,104,${(1 - d / 120) * 0.12})`; ctx!.lineWidth = 0.5; ctx!.stroke()
          }
        }
      }
      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ══════════════ LIVE FEED GENERATION ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return
    const track = feedTrackRef.current
    if (!track) return

    const names = ['Zeynep K.', 'Mehmet A.', 'Deniz Y.', 'Ayse B.', 'Can S.', 'Elif D.', 'Omer T.', 'Selin M.', 'Berk O.', 'Ece P.', 'Kaan L.', 'Naz R.', 'Burak V.']
    const cities = ['Kadikoy', 'Besiktas', 'Ankara', 'Izmir', 'Bursa', 'Eskisehir', 'Antalya', 'Konya', 'Gaziantep', 'Trabzon', 'Adana']
    const tasks = ['kitap topladi', 'park temizledi', 'yasliya yardim etti', 'fidan dikti', 'kan bagisladi', 'mama dagitti', 'okuma atolyesi verdi', 'gida dagitimi yapti']
    const mins = ['2dk once', '4dk once', '7dk once', '12dk once', '15dk once', '18dk once', '24dk once', '32dk once']
    const karmaList = [50, 100, 120, 150, 180, 200, 250]

    function item() {
      const n = names[Math.floor(Math.random() * names.length)]
      const c = cities[Math.floor(Math.random() * cities.length)]
      const t = tasks[Math.floor(Math.random() * tasks.length)]
      const m = mins[Math.floor(Math.random() * mins.length)]
      const k = karmaList[Math.floor(Math.random() * karmaList.length)]
      const initial = n[0]
      return `<div class="feed-item"><div class="av">${initial}</div><b>${n}</b><span>\u00b7</span><span>${c}</span><span>\u00b7</span><span>${t}</span><span class="t">${m}</span><span class="k">+${k}</span></div>`
    }

    let html = ''
    for (let i = 0; i < 28; i++) html += item()
    track.innerHTML = html + html // duplicate for seamless scroll

    // Live hero count +1 every few seconds
    const lc = liveCountRef.current
    let count = 1247
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1
      if (lc) lc.textContent = count.toLocaleString('tr-TR')
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // ══════════════ NETWORK MAP ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return
    const c = networkCanvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    let animId: number

    function resize() {
      c!.width = c!.offsetWidth * 2
      c!.height = c!.offsetHeight * 2
      ctx!.scale(2, 2)
    }
    resize()

    const onResize = () => {
      ctx!.setTransform(1, 0, 0, 1, 0, 0)
      resize()
    }
    window.addEventListener('resize', onResize)

    const W = () => c!.offsetWidth
    const H = () => c!.offsetHeight

    const cities = [
      { x: 0.22, y: 0.20, r: 18, name: 'ISTANBUL', bg: true },
      { x: 0.34, y: 0.22, r: 10, name: 'Kocaeli', bg: false },
      { x: 0.40, y: 0.26, r: 9, name: 'Bursa', bg: false },
      { x: 0.48, y: 0.40, r: 15, name: 'ANKARA', bg: true },
      { x: 0.44, y: 0.46, r: 7, name: 'Eskisehir', bg: false },
      { x: 0.54, y: 0.36, r: 7, name: 'Kayseri', bg: false },
      { x: 0.22, y: 0.52, r: 13, name: 'IZMIR', bg: true },
      { x: 0.28, y: 0.58, r: 8, name: 'Aydin', bg: false },
      { x: 0.30, y: 0.62, r: 7, name: 'Mugla', bg: false },
      { x: 0.40, y: 0.70, r: 10, name: 'Antalya', bg: false },
      { x: 0.58, y: 0.62, r: 9, name: 'Adana', bg: false },
      { x: 0.68, y: 0.60, r: 8, name: 'G.antep', bg: false },
      { x: 0.74, y: 0.58, r: 7, name: 'Urfa', bg: false },
      { x: 0.80, y: 0.54, r: 7, name: 'Diyarbakir', bg: false },
      { x: 0.60, y: 0.20, r: 8, name: 'Samsun', bg: false },
      { x: 0.72, y: 0.22, r: 7, name: 'Trabzon', bg: false },
      { x: 0.82, y: 0.28, r: 6, name: 'Erzurum', bg: false },
      { x: 0.90, y: 0.46, r: 7, name: 'Van', bg: false },
      { x: 0.52, y: 0.50, r: 7, name: 'Konya', bg: false },
      { x: 0.62, y: 0.46, r: 6, name: 'Malatya', bg: false },
      { x: 0.64, y: 0.38, r: 6, name: 'Sivas', bg: false },
    ]

    const conns: [number, number][] = []
    const hubs = [0, 3, 6]
    hubs.forEach(h => {
      cities.forEach((_, i) => {
        if (i !== h && !hubs.includes(i)) conns.push([h, i])
      })
    })
    ;([[3, 6], [6, 9], [3, 10], [0, 14], [3, 15], [3, 17], [14, 15]] as [number, number][]).forEach(p => conns.push(p))

    let t = 0
    let pulses: { a: number; b: number; p: number; speed: number }[] = []

    let pulseTimeout: ReturnType<typeof setTimeout>
    function pulseLoop() {
      const [a, b] = conns[Math.floor(Math.random() * conns.length)]
      pulses.push({ a, b, p: 0, speed: 0.012 + Math.random() * 0.01 })
      pulseTimeout = setTimeout(pulseLoop, 500 + Math.random() * 400)
    }
    pulseLoop()

    function tick() {
      t += 0.01
      const w = W(), h = H()
      ctx!.clearRect(0, 0, w, h)

      // connections
      conns.forEach(([a, b]) => {
        const A = cities[a], B = cities[b]
        ctx!.beginPath()
        ctx!.moveTo(A.x * w, A.y * h)
        ctx!.lineTo(B.x * w, B.y * h)
        ctx!.strokeStyle = 'rgba(232,194,104,.08)'; ctx!.lineWidth = 0.7; ctx!.stroke()
      })

      // pulses
      pulses = pulses.filter(p => p.p < 1)
      pulses.forEach(pl => {
        const A = cities[pl.a], B = cities[pl.b]
        pl.p += pl.speed
        const x = A.x * w + (B.x - A.x) * w * pl.p
        const y = A.y * h + (B.y - A.y) * h * pl.p
        // trail
        ctx!.beginPath()
        ctx!.moveTo(A.x * w + (B.x - A.x) * w * Math.max(0, pl.p - 0.15), A.y * h + (B.y - A.y) * h * Math.max(0, pl.p - 0.15))
        ctx!.lineTo(x, y)
        ctx!.strokeStyle = `rgba(232,194,104,${(1 - pl.p) * 0.8})`; ctx!.lineWidth = 1.4; ctx!.stroke()
        // head
        ctx!.beginPath(); ctx!.arc(x, y, 2, 0, Math.PI * 2)
        ctx!.fillStyle = '#E8C268'; ctx!.fill()
      })

      // cities
      cities.forEach((ci, idx) => {
        const cx = ci.x * w, cy = ci.y * h
        const pulse = ci.bg ? (Math.sin(t * 2 + idx) + 1) / 2 * 0.5 + 0.5 : 1
        if (ci.bg) {
          ctx!.beginPath(); ctx!.arc(cx, cy, ci.r + 8 * pulse, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(232,194,104,${0.05 + 0.08 * pulse})`; ctx!.fill()
        }
        ctx!.beginPath(); ctx!.arc(cx, cy, ci.r / 3, 0, Math.PI * 2)
        ctx!.fillStyle = ci.bg ? '#E8C268' : 'rgba(232,194,104,.7)'; ctx!.fill()
        // label
        if (ci.bg || ci.r >= 8) {
          ctx!.font = ci.bg ? '600 11px "JetBrains Mono"' : '500 10px var(--font-sans), "Plus Jakarta Sans", sans-serif'
          ctx!.fillStyle = ci.bg ? '#F4EEDF' : 'rgba(206,197,178,.7)'
          ctx!.textAlign = 'left'
          ctx!.fillText(ci.name, cx + ci.r / 3 + 6, cy + 3)
        }
      })

      animId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(pulseTimeout)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ══════════════ CUSTOM CURSOR ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return
    const cd = cursorDotRef.current
    const cr = cursorRingRef.current
    if (!cd || !cr) return

    const onMove = (e: MouseEvent) => {
      cd.style.left = e.clientX + 'px'; cd.style.top = e.clientY + 'px'
      cr.style.left = e.clientX + 'px'; cr.style.top = e.clientY + 'px'
    }
    window.addEventListener('mousemove', onMove)

    const enterHandler = () => { cr.style.transform = 'translate(-50%,-50%) scale(1.8)'; cr.style.borderColor = 'rgba(232,194,104,.8)' }
    const leaveHandler = () => { cr.style.transform = 'translate(-50%,-50%) scale(1)'; cr.style.borderColor = 'rgba(232,194,104,.4)' }

    const interactiveEls = document.querySelectorAll('a,button,.store-btn,.stat-card')
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', enterHandler)
      el.addEventListener('mouseleave', leaveHandler)
    })

    return () => {
      window.removeEventListener('mousemove', onMove)
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', enterHandler)
        el.removeEventListener('mouseleave', leaveHandler)
      })
    }
  }, [])

  // ══════════════ FLOATING KARMA POPS ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stage = tokenStageRef.current
    if (!stage) return

    let popInterval: ReturnType<typeof setInterval>
    let popTimeout: ReturnType<typeof setTimeout>

    const initPops = async () => {
      const gsapModule = await import('gsap')
      const gsap = (gsapModule.default || gsapModule) as any

      function pop() {
        const el = document.createElement('div')
        el.className = 'karma-pop'
        const amt = [50, 100, 150, 200, 250][Math.floor(Math.random() * 5)]
        el.innerHTML = `<svg width="12" height="12" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#E8C268"/></svg>+${amt}`
        el.style.left = (20 + Math.random() * 60) + '%'
        el.style.top = (30 + Math.random() * 40) + '%'
        el.style.opacity = '0'
        stage!.appendChild(el)
        gsap.to(el, {
          opacity: 1, y: -60, duration: 0.4, ease: 'power2.out', onComplete() {
            gsap.to(el, { opacity: 0, y: -100, duration: 0.6, delay: 0.4, ease: 'power2.in', onComplete() { el.remove() } })
          }
        })
      }

      popInterval = setInterval(pop, 1800)
      popTimeout = setTimeout(pop, 500)
    }

    initPops()

    return () => {
      clearInterval(popInterval)
      clearTimeout(popTimeout)
    }
  }, [])

  // ══════════════ FADE-IN OBSERVER ══════════════
  useEffect(() => {
    if (typeof window === 'undefined') return

    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) }
    }), { threshold: 0.15 })

    document.querySelectorAll('.fade-in').forEach(el => io.observe(el))

    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

        html,body{margin:0;padding:0;background:#1A1612;color:#F4EEDF;font-family:var(--font-sans),'Plus Jakarta Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        *{box-sizing:border-box}
        a{color:inherit;text-decoration:none}
        button{cursor:pointer;font-family:inherit}
        .wrap{max-width:1280px;margin:0 auto;padding:0 32px;position:relative}
        .mono{font-family:'JetBrains Mono',ui-monospace,monospace}

        /* === NOISE / GRAIN === */
        body::after{
          content:"";position:fixed;inset:0;pointer-events:none;z-index:100;opacity:.05;mix-blend-mode:overlay;
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 .91 0 0 0 0 .76 0 0 0 0 .41 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        /* === CURSOR === */
        .cursor-dot{position:fixed;width:8px;height:8px;border-radius:50%;background:#E8C268;pointer-events:none;z-index:200;transform:translate(-50%,-50%);transition:transform .15s ease,width .2s,height .2s;mix-blend-mode:difference}
        .cursor-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(232,194,104,.4);border-radius:50%;pointer-events:none;z-index:199;transform:translate(-50%,-50%);transition:transform .3s cubic-bezier(.2,.8,.2,1)}

        /* === NAV === */
        nav.top{position:fixed;top:0;left:0;right:0;z-index:50;backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2);background:rgba(26,22,18,.62);border-bottom:1px solid rgba(232,194,104,.08);transition:all .3s}
        nav.top .inner{display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 32px;max-width:1440px;margin:0 auto}
        nav.top .links{display:flex;gap:28px;font-size:13px;color:#CEC5B2}
        nav.top .links a{position:relative;transition:color .2s}
        nav.top .links a:hover{color:#E8C268}
        nav.top .links a::after{content:"";position:absolute;bottom:-6px;left:0;right:0;height:1px;background:#E8C268;transform:scaleX(0);transform-origin:left;transition:transform .3s}
        nav.top .links a:hover::after{transform:scaleX(1)}
        .btn{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 18px;border-radius:999px;font-weight:700;font-size:13px;letter-spacing:-.01em;transition:transform 160ms cubic-bezier(.23,1,.32,1),background 200ms ease,border-color 200ms ease,box-shadow 200ms ease;border:none;white-space:nowrap}
        .btn:active{transform:scale(0.97)}
        .btn-primary{background:#E8C268;color:#1A1612}
        @media (hover:hover) and (pointer:fine){.btn-primary:hover{background:#F4D98A;transform:translateY(-1px);box-shadow:0 8px 24px rgba(232,194,104,.3)}}
        .btn-ghost{background:transparent;color:#F4EEDF;border:1px solid rgba(232,194,104,.22)}
        @media (hover:hover) and (pointer:fine){.btn-ghost:hover{border-color:rgba(232,194,104,.5);background:rgba(232,194,104,.05)}}

        /* === HERO === */
        .hero{position:relative;min-height:100vh;padding:120px 0 60px;display:flex;align-items:center;overflow:hidden}
        #hero-canvas{position:absolute;inset:0;z-index:1;pointer-events:none}
        .hero-glow{position:absolute;top:30%;left:50%;transform:translate(-50%,-50%);width:1000px;height:1000px;background:radial-gradient(circle,rgba(232,194,104,.22),transparent 55%);pointer-events:none;z-index:0;filter:blur(60px)}
        .hero-content{position:relative;z-index:10;width:100%}
        .hero-grid{display:grid;grid-template-columns:1.15fr .85fr;gap:60px;align-items:center}

        .eyebrow-live{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;background:rgba(232,194,104,.08);border:1px solid rgba(232,194,104,.24);border-radius:999px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#E8C268;font-weight:600;margin-bottom:28px}
        .pulse-dot{width:8px;height:8px;border-radius:50%;background:#E8C268;animation:pulse 1.8s ease-in-out infinite;box-shadow:0 0 12px #E8C268}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}

        h1.display{font-family:var(--font-display),'Fraunces',serif;font-weight:400;font-size:clamp(56px,8vw,108px);line-height:.95;letter-spacing:-.045em;margin:0 0 28px}
        h1.display em{font-style:italic;color:#E8C268;position:relative;display:inline-block}
        h1.display .word{display:inline-block;opacity:0;transform:translateY(40px)}

        .lead{font-size:19px;line-height:1.6;color:#CEC5B2;max-width:540px;margin:0 0 40px;opacity:0}
        .cta-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;opacity:0}

        .store-btn{display:inline-flex;align-items:center;gap:12px;background:rgba(46,41,35,.8);border:1px solid rgba(232,194,104,.22);color:#F4EEDF;height:56px;padding:0 22px;border-radius:14px;text-align:left;backdrop-filter:blur(12px);transition:transform 200ms cubic-bezier(.23,1,.32,1),border-color 200ms ease,box-shadow 200ms ease}
        .store-btn:active{transform:scale(0.97)}
        @media (hover:hover) and (pointer:fine){.store-btn:hover{border-color:rgba(232,194,104,.5);transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,0,0,.3)}}
        .store-btn .sm{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:#A89E8A;font-weight:600}
        .store-btn .lg{font-family:var(--font-display),'Fraunces',serif;font-size:18px;font-weight:500;letter-spacing:-.01em;margin-top:1px}

        .hero-meta{display:flex;gap:40px;margin-top:44px;padding-top:28px;border-top:1px solid rgba(232,194,104,.12);opacity:0}
        .hero-meta .m b{display:block;font-family:var(--font-display),'Fraunces',serif;font-weight:500;font-size:28px;color:#F4EEDF;letter-spacing:-.02em;margin-bottom:2px}
        .hero-meta .m span{font-size:12px;color:#A89E8A;letter-spacing:.04em}

        /* === HERO 3D TOKEN STAGE === */
        .token-stage{position:relative;width:100%;height:560px;display:flex;align-items:center;justify-content:center}
        #three-canvas{position:absolute;inset:0}
        .token-overlay{position:absolute;top:10%;left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(26,22,18,.8);border:1px solid rgba(232,194,104,.3);border-radius:999px;font-family:'JetBrains Mono',monospace;font-size:10px;color:#E8C268;letter-spacing:.1em;text-transform:uppercase;backdrop-filter:blur(10px);z-index:5}
        .token-stats{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);display:flex;gap:24px;z-index:5}
        .token-stat{font-family:'JetBrains Mono',monospace;font-size:10px;color:#A89E8A;letter-spacing:.08em}
        .token-stat b{color:#E8C268;display:block;font-size:13px;margin-bottom:2px}

        /* Floating karma pops */
        .karma-pop{position:absolute;z-index:6;pointer-events:none;display:flex;align-items:center;gap:6px;padding:6px 12px;background:rgba(232,194,104,.14);border:1px solid rgba(232,194,104,.4);border-radius:999px;font-family:'JetBrains Mono',monospace;font-size:12px;color:#E8C268;font-weight:700;backdrop-filter:blur(8px)}

        /* === LIVE FEED === */
        .live-feed{position:relative;padding:30px 0;border-top:1px solid rgba(232,194,104,.08);border-bottom:1px solid rgba(232,194,104,.08);background:rgba(36,32,27,.4);overflow:hidden}
        .live-feed::before,.live-feed::after{content:"";position:absolute;top:0;bottom:0;width:120px;z-index:2;pointer-events:none}
        .live-feed::before{left:0;background:linear-gradient(to right,#1A1612,transparent)}
        .live-feed::after{right:0;background:linear-gradient(to left,#1A1612,transparent)}
        .feed-track{display:flex;gap:20px;animation:scroll 40s linear infinite;width:max-content}
        @keyframes scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .feed-item{display:flex;align-items:center;gap:10px;padding:10px 16px;background:rgba(46,41,35,.6);border:1px solid rgba(232,194,104,.1);border-radius:999px;white-space:nowrap;font-size:13px;color:#CEC5B2}
        .feed-item .av{width:24px;height:24px;border-radius:50%;background:#C8553D;display:flex;align-items:center;justify-content:center;font-size:10px;color:#F4EEDF;font-weight:700;font-family:var(--font-display),'Fraunces',serif}
        .feed-item b{color:#F4EEDF}
        .feed-item .t{color:#A89E8A;font-family:'JetBrains Mono',monospace;font-size:11px}
        .feed-item .k{color:#E8C268;font-weight:700;font-family:'JetBrains Mono',monospace}

        /* === SECTION GENERIC === */
        section.s{padding:140px 0;position:relative}
        .sec-eyebrow{font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#A89E8A;font-weight:700;margin-bottom:16px;display:inline-flex;align-items:center;gap:8px}
        .sec-eyebrow::before{content:"";width:24px;height:1px;background:#E8C268}
        .sec-title{font-family:var(--font-display),'Fraunces',serif;font-weight:400;font-size:clamp(40px,5.5vw,72px);line-height:1.02;letter-spacing:-.035em;margin:0 0 24px;max-width:900px}
        .sec-title em{font-style:italic;color:#E8C268}
        .sec-lead{font-size:17px;line-height:1.55;color:#CEC5B2;max-width:600px}

        /* === SCROLL-PINNED PHONE SECTION === */
        .story{position:relative}
        .story-pin{height:400vh;position:relative}
        .story-sticky{position:sticky;top:0;height:100vh;display:flex;align-items:center;overflow:hidden}
        .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;width:100%;max-width:1280px;margin:0 auto;padding:0 32px;align-items:center}
        .story-phone{display:flex;justify-content:center;position:relative}
        .story-phone-frame{width:360px;height:740px;border-radius:44px;background:#000;padding:10px;box-shadow:0 40px 100px rgba(0,0,0,.6),0 0 0 1px rgba(232,194,104,.2);position:relative}
        .story-phone-frame::before{content:"";position:absolute;top:10px;left:50%;transform:translateX(-50%);width:110px;height:32px;border-radius:20px;background:#000;z-index:10}
        .story-screen{width:100%;height:100%;border-radius:34px;overflow:hidden;background:#1A1612;position:relative}
        .story-screen-layer{position:absolute;inset:0;opacity:0}
        .story-screen-layer.active{opacity:1}
        .story-texts{position:relative;height:400px}
        .story-text{position:absolute;inset:0;opacity:0}
        .story-text .num{font-family:'JetBrains Mono',monospace;font-size:11px;color:#E8C268;letter-spacing:.22em;margin-bottom:12px}
        .story-text h3{font-family:var(--font-display),'Fraunces',serif;font-weight:400;font-size:48px;line-height:1.05;letter-spacing:-.03em;margin:0 0 18px}
        .story-text h3 em{font-style:italic;color:#E8C268}
        .story-text p{font-size:16px;line-height:1.6;color:#CEC5B2;max-width:420px;margin:0}
        .story-progress{position:absolute;left:-40px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:16px}
        .story-progress .dot{width:6px;height:6px;border-radius:999px;background:rgba(232,194,104,.2);transition:all .4s}
        .story-progress .dot.active{background:#E8C268;height:32px}

        /* === STATS — COUNT UP === */
        .stats-section{padding:120px 0;background:#24201B;position:relative;overflow:hidden}
        .stats-section::before{content:"";position:absolute;top:-200px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(232,194,104,.08),transparent 60%);pointer-events:none}
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:56px;border-top:1px solid rgba(232,194,104,.12);border-bottom:1px solid rgba(232,194,104,.12)}
        .stat-card{padding:40px 32px;border-right:1px solid rgba(232,194,104,.1);position:relative;transition:background 200ms ease}
        .stat-card:last-child{border-right:none}
        @media (hover:hover) and (pointer:fine){.stat-card:hover{background:rgba(232,194,104,.04)}}
        .stat-num{font-family:var(--font-display),'Fraunces',serif;font-weight:500;font-size:72px;line-height:1;letter-spacing:-.035em;color:#F4EEDF;margin-bottom:8px;font-variant-numeric:tabular-nums}
        .stat-num em{font-style:italic;color:#E8C268;font-size:52px;margin-right:4px}
        .stat-lbl{font-size:12px;color:#A89E8A;letter-spacing:.08em;text-transform:uppercase;font-weight:600}
        .stat-trend{font-size:11px;color:#6B8E4E;margin-top:8px;font-family:'JetBrains Mono',monospace}

        /* === ETKI KARTLARI === */
        .proof{padding:140px 0;background:#1A1612;position:relative}
        .impact-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:60px}
        .impact-card{background:#2E2923;border:1px solid rgba(232,194,104,.1);border-radius:20px;overflow:hidden;transition:transform 250ms cubic-bezier(.23,1,.32,1),border-color 250ms ease}
        @media (hover:hover) and (pointer:fine){.impact-card:hover{border-color:rgba(232,194,104,.3);transform:translateY(-4px)}}
        .impact-img{height:200px;background-size:cover;background-position:center;position:relative}
        .impact-img::after{content:"";position:absolute;inset:0;background:linear-gradient(transparent 50%,rgba(26,22,18,.8))}
        .impact-body{padding:22px}
        .impact-tag{display:inline-block;font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#E8C268;font-weight:700;background:rgba(232,194,104,.1);padding:4px 10px;border-radius:999px;margin-bottom:12px}
        .impact-card h4{font-family:var(--font-display),'Fraunces',serif;font-size:20px;font-weight:500;margin:0 0 8px;line-height:1.2}
        .impact-card p{font-size:13px;color:#A89E8A;line-height:1.55;margin:0 0 16px}
        .impact-stat{display:flex;gap:16px;padding-top:14px;border-top:1px solid rgba(232,194,104,.08)}
        .impact-stat div{font-family:var(--font-display),'Fraunces',serif;font-size:18px;color:#F4EEDF}
        .impact-stat span{display:block;font-family:var(--font-sans);font-size:10px;color:#A89E8A;margin-top:2px}

        /* === ODÜLLER === */
        .rewards-section{padding:140px 0;background:#24201B;position:relative}
        .rewards-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px;margin-top:56px}
        .reward-card{background:#1A1612;border:1px solid rgba(232,194,104,.12);border-radius:18px;padding:24px 18px;text-align:center;transition:transform 250ms cubic-bezier(.23,1,.32,1),border-color 250ms ease}
        @media (hover:hover) and (pointer:fine){.reward-card:hover{border-color:rgba(232,194,104,.35);transform:translateY(-4px)}}
        .reward-logo{width:56px;height:56px;border-radius:14px;background:#2E2923;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;font-size:24px}
        .reward-card h5{font-family:var(--font-display),'Fraunces',serif;font-size:16px;font-weight:500;margin:0 0 4px;color:#F4EEDF}
        .reward-card .karma-cost{font-family:'JetBrains Mono',monospace;font-size:12px;color:#E8C268;font-weight:700}
        .reward-card .reward-desc{font-size:11px;color:#A89E8A;margin-top:6px;line-height:1.4}

        @media (max-width:960px){
          .impact-grid{grid-template-columns:1fr}
          .rewards-grid{grid-template-columns:1fr 1fr}
        }

        /* === NETWORK MAP === */
        .network{padding:140px 0;position:relative;overflow:hidden}
        #network-canvas{width:100%;height:500px;border-radius:20px;background:radial-gradient(circle at 50% 50%,#24201B,#1A1612);border:1px solid rgba(232,194,104,.1)}

        /* === CTA FINAL === */
        .cta-final{text-align:center;padding:160px 0;position:relative;overflow:hidden}
        .cta-final::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(232,194,104,.18),transparent 60%);pointer-events:none}
        .cta-final h2{font-family:var(--font-display),'Fraunces',serif;font-weight:400;font-size:clamp(48px,8vw,108px);line-height:.95;letter-spacing:-.045em;margin:0 0 24px;position:relative;z-index:2}
        .cta-final h2 em{font-style:italic;color:#E8C268}
        .cta-final .p{font-size:18px;color:#CEC5B2;margin:0 auto 44px;max-width:520px;line-height:1.55;position:relative;z-index:2}
        .qr-row{display:inline-flex;align-items:center;gap:20px;background:rgba(46,41,35,.7);border:1px solid rgba(232,194,104,.16);border-radius:22px;padding:18px 22px;margin-top:36px;backdrop-filter:blur(12px);position:relative;z-index:2}
        .qr-row .qr{width:92px;height:92px;background:#F4EEDF;border-radius:12px;padding:8px}
        .qr-row .txt{text-align:left;max-width:200px}
        .qr-row .txt .h{font-family:var(--font-display),'Fraunces',serif;font-size:18px;margin-bottom:4px}
        .qr-row .txt .s{font-size:12px;color:#A89E8A;line-height:1.45}

        /* === FOOTER === */
        footer{padding:80px 0 40px;border-top:1px solid rgba(232,194,104,.1);background:#1A1612;position:relative;z-index:5}
        footer .g{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:40px}
        footer h5{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#A89E8A;margin:0 0 16px;font-weight:700}
        footer ul{list-style:none;padding:0;margin:0}
        footer li{font-size:14px;color:#CEC5B2;margin-bottom:10px}
        footer li a:hover{color:#E8C268}
        .copy{margin-top:60px;padding-top:24px;border-top:1px solid rgba(232,194,104,.08);display:flex;justify-content:space-between;font-size:12px;color:#7A6F5E}

        /* fade in utility */
        .fade-in{opacity:0;transform:translateY(20px) scale(0.98);transition:opacity .6s cubic-bezier(.23,1,.32,1),transform .6s cubic-bezier(.23,1,.32,1)}
        .fade-in.in{opacity:1;transform:translateY(0) scale(1)}

        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}

        @media (max-width:960px){
          .hero-grid{grid-template-columns:1fr;gap:40px}
          .story-grid{grid-template-columns:1fr;gap:40px}
          .stats-grid{grid-template-columns:1fr 1fr}
          .proof-canvas{grid-template-columns:1fr}
          footer .g{grid-template-columns:1fr 1fr}
          .token-stage{height:400px}
          nav.top .links{display:none}
          .cursor-dot,.cursor-ring{display:none}
        }
      `}</style>

      {/* Custom cursor */}
      <div className="cursor-dot" ref={cursorDotRef} />
      <div className="cursor-ring" ref={cursorRingRef} />

      {/* NAV */}
      <nav className="top">
        <div className="inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="30" height="30" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#24201B" /><circle cx="32" cy="32" r="28.5" fill="none" stroke="#E8C268" strokeWidth="1.2" strokeOpacity=".7" /><g transform="translate(32,32)"><rect x="-3" y="-4" width="6" height="18" rx="1" fill="#F4EEDF" /><rect x="-7" y="13" width="14" height="2.4" rx="1" fill="#F4EEDF" /><circle cx="0" cy="-11" r="4.2" fill="#E8C268" /></g></svg>
            <span style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 22, fontWeight: 500, letterSpacing: '-.02em' }}>
              Iyi<em style={{ fontStyle: 'italic', color: '#E8C268' }}>Biri</em>
            </span>
          </div>
          <div className="links">
            <a href="#nasil">Nasil calisir</a>
            <a href="#karma">Karma</a>
            <a href="#stklar">STK&apos;lar</a>
            <a href="#manifesto">Manifesto</a>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/auth/login" className="btn btn-ghost">Giris</Link>
            <Link href="/auth/signup" className="btn btn-primary">
              Indir
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <canvas id="hero-canvas" ref={heroCanvasRef} />
        <div className="hero-glow" />
        <div className="wrap hero-content">
          <div className="hero-grid">
            <div>
              <div className="eyebrow-live">
                <span className="pulse-dot" />
                <span>Su an <b ref={liveCountRef} style={{ color: '#F4EEDF', fontWeight: 700 }}>1.247</b> kisi gonullu</span>
              </div>
              <h1 className="display">
                <span className="word"><em>Iyilik</em></span><br />
                <span className="word">biriktirilir.</span>
              </h1>
              <p className="lead">
                Mahallendeki STK&apos;lara gonullu ol, gercek gorevler tamamla, <b style={{ color: '#E8C268' }}>Karma</b> biriktir. Her iyilik gorunur, her katki degerli.
              </p>
              <div className="cta-row">
                <Link className="store-btn" href="/auth/login">
                  <svg width="22" height="26" viewBox="0 0 24 28" fill="#F4EEDF"><path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" /></svg>
                  <div><div className="sm">Edin</div><div className="lg">App Store</div></div>
                </Link>
                <Link className="store-btn" href="/auth/login">
                  <svg width="22" height="24" viewBox="0 0 24 26" fill="#F4EEDF"><path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626c.615.354.615 1.235 0 1.59l-2.808 1.626L15.212 12l2.486-2.491zM5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.635z" /></svg>
                  <div><div className="sm">Edin</div><div className="lg">Google Play</div></div>
                </Link>
              </div>
              <div className="hero-meta">
                <div className="m"><b data-cu="18247">0</b><span>Aktif gonullu</span></div>
                <div className="m"><b data-cu="248">0</b><span>Partner STK</span></div>
                <div className="m"><b data-cu="62103">0</b><span>Tamamlanan gorev</span></div>
              </div>
            </div>

            {/* 3D TOKEN STAGE */}
            <div className="token-stage" ref={tokenStageRef}>
              <div className="token-overlay">karma &middot; iyilik biriktir</div>
              <canvas id="three-canvas" ref={threeCanvasRef} />
              <div className="token-stats">
                <div className="token-stat"><b>18.247</b>gonullu</div>
                <div className="token-stat"><b>2.4M</b>toplam karma</div>
                <div className="token-stat"><b>62.103</b>tamamlanan gorev</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE FEED */}
      <div className="live-feed">
        <div className="feed-track" ref={feedTrackRef} />
      </div>

      {/* SCROLL STORY -- 4 phone ekrani, pinned */}
      <section className="story" id="nasil">
        <div className="wrap" style={{ paddingBottom: 40 }}>
          <div className="sec-eyebrow">Nasil calisir</div>
          <h2 className="sec-title">Iyilik <em>soyut</em> degil. <br />Bir gorev. Bir saat. <em>Bir etki.</em></h2>
        </div>

        <div className="story-pin">
          <div className="story-sticky">
            <div className="story-grid">
              {/* Texts */}
              <div className="story-texts">
                <div className="story-text" data-step="0">
                  <div className="num">01 &middot; BUL</div>
                  <h3>Mahallende <em>sana uygun</em> gorev.</h3>
                  <p>Konum, ilgi alani, sure filtresi. Yakinindaki her STK&apos;nin aktif cagrilari tek yerde. Kitap paketleme, yasliya market, park temizligi -- hepsi gercek, hepsi dogrulanmis.</p>
                </div>
                <div className="story-text" data-step="1">
                  <div className="num">02 &middot; KATIL</div>
                  <h3>Tek dokunusla <em>basvur.</em></h3>
                  <p>STK koordinatoru seni gorur, onaylar. Takvimine eklenir. Hatirlatma gelir. Uygulamadan cikmadan her sey hallolur.</p>
                </div>
                <div className="story-text" data-step="2">
                  <div className="num">03 &middot; YAP</div>
                  <h3>Gerceklestir. <em>Check-in yap.</em></h3>
                  <p>Alana vardiginda QR kodu okut, gorev baslar. Biten gorev koordinator tarafindan dogrulanir -- fotografli, imzali, sahitli.</p>
                </div>
                <div className="story-text" data-step="3">
                  <div className="num">04 &middot; KARMA</div>
                  <h3>Karma kazan, <em>fark yarat.</em></h3>
                  <p>Gorev tamamlaninca Karma hesabina duser. Seviye atla, rozet kazan, odullerini kullan. Itibarin artik gercek ve gorunur.</p>
                </div>
              </div>

              {/* Phone */}
              <div className="story-phone">
                <div className="story-progress">
                  <div className="dot" data-i="0" />
                  <div className="dot" data-i="1" />
                  <div className="dot" data-i="2" />
                  <div className="dot" data-i="3" />
                </div>
                <div className="story-phone-frame">
                  <div className="story-screen">
                    {/* Layer 0: Kesfet */}
                    <div className="story-screen-layer" data-layer="0">
                      <div style={{ padding: '56px 18px 14px', background: '#1A1612', borderBottom: '1px solid rgba(232,194,104,.08)' }}>
                        <div style={{ fontSize: 10, letterSpacing: '.16em', color: '#A89E8A', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>Kesfet &middot; 47 gorev yakinda</div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                          <span style={{ fontSize: 11, padding: '5px 12px', background: '#E8C268', color: '#1A1612', borderRadius: 999, fontWeight: 700 }}>Tumu</span>
                          <span style={{ fontSize: 11, padding: '5px 12px', background: 'rgba(232,194,104,.1)', color: '#CEC5B2', borderRadius: 999 }}>Cevre</span>
                          <span style={{ fontSize: 11, padding: '5px 12px', background: 'rgba(232,194,104,.1)', color: '#CEC5B2', borderRadius: 999 }}>Egitim</span>
                          <span style={{ fontSize: 11, padding: '5px 12px', background: 'rgba(232,194,104,.1)', color: '#CEC5B2', borderRadius: 999 }}>Hayvan</span>
                        </div>
                      </div>
                      <div style={{ padding: 12 }}>
                        {/* Task cards */}
                        <div style={{ background: '#2E2923', border: '1px solid rgba(232,194,104,.1)', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
                          <div style={{ height: 76, background: 'linear-gradient(135deg,#C8553D,#8a3a27)' }} />
                          <div style={{ padding: 12 }}>
                            <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 14, color: '#F4EEDF', lineHeight: 1.3 }}>Kadikoy&apos;de kitap toplama</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                              <div style={{ fontSize: 10, color: '#A89E8A' }}>Cts &middot; 10:00 &middot; 3s</div>
                              <div style={{ background: 'rgba(232,194,104,.14)', color: '#E8C268', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>+150</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#2E2923', border: '1px solid rgba(232,194,104,.1)', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
                          <div style={{ height: 76, background: 'linear-gradient(135deg,#6B8E4E,#4a6237)' }} />
                          <div style={{ padding: 12 }}>
                            <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 14, color: '#F4EEDF', lineHeight: 1.3 }}>Park temizligi &middot; Maltepe</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                              <div style={{ fontSize: 10, color: '#A89E8A' }}>Pzr &middot; 09:00 &middot; 2s</div>
                              <div style={{ background: 'rgba(232,194,104,.14)', color: '#E8C268', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>+100</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#2E2923', border: '1px solid rgba(232,194,104,.1)', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
                          <div style={{ height: 76, background: 'linear-gradient(135deg,#4A6FA5,#2d4a7a)' }} />
                          <div style={{ padding: 12 }}>
                            <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 14, color: '#F4EEDF', lineHeight: 1.3 }}>Sokak hayvani mama dagitimi</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                              <div style={{ fontSize: 10, color: '#A89E8A' }}>Cts &middot; 14:00 &middot; 2s</div>
                              <div style={{ background: 'rgba(232,194,104,.14)', color: '#E8C268', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999 }}>+120</div>
                            </div>
                          </div>
                        </div>
                        <div style={{ background: '#2E2923', border: '1px solid rgba(232,194,104,.08)', borderRadius: 16, padding: '12px 14px' }}>
                          <div style={{ fontSize: 11, color: '#A89E8A' }}>Yakininda yeni</div>
                          <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 14, color: '#F4EEDF', marginTop: 2 }}>Cocuklara okuma atolyesi</div>
                        </div>
                      </div>
                    </div>

                    {/* Layer 1: Basvur */}
                    <div className="story-screen-layer" data-layer="1">
                      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: 240, background: 'linear-gradient(135deg,#C8553D,#8a3a27)', padding: '56px 20px 14px', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: 56, left: 20, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(244,238,223,.7)', fontWeight: 700 }}>Gorev</div>
                          <div style={{ position: 'absolute', bottom: 14, left: 20, right: 20 }}>
                            <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 22, color: '#F4EEDF', lineHeight: 1.1 }}>Kadikoy&apos;de kitap toplama ve paketleme</div>
                          </div>
                        </div>
                        <div style={{ flex: 1, padding: 16, background: '#1A1612' }}>
                          <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                            <div style={{ flex: 1, background: '#2E2923', border: '1px solid rgba(232,194,104,.1)', borderRadius: 10, padding: '8px 10px' }}>
                              <div style={{ fontSize: 9, color: '#A89E8A', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700 }}>Ne zaman</div>
                              <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 13, color: '#F4EEDF', marginTop: 2 }}>Cts &middot; 10:00</div>
                            </div>
                            <div style={{ flex: 1, background: '#2E2923', border: '1px solid rgba(232,194,104,.1)', borderRadius: 10, padding: '8px 10px' }}>
                              <div style={{ fontSize: 9, color: '#A89E8A', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700 }}>Sure</div>
                              <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 13, color: '#F4EEDF', marginTop: 2 }}>3 saat</div>
                            </div>
                          </div>
                          <div style={{ background: 'rgba(232,194,104,.08)', border: '1px solid rgba(232,194,104,.3)', borderRadius: 12, padding: '10px 12px', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontSize: 9, color: '#B58F3D', letterSpacing: '.14em', textTransform: 'uppercase', fontWeight: 700 }}>Odul</div>
                              <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 16, color: '#E8C268', marginTop: 1 }}>+150 Karma</div>
                            </div>
                            <svg width="22" height="22" viewBox="0 0 64 64">
                              <defs><radialGradient id="sx1" cx="40%" cy="36%" r="70%"><stop offset="0%" stopColor="#F4D98A" /><stop offset="100%" stopColor="#B58F3D" /></radialGradient></defs>
                              <circle cx="32" cy="32" r="30" fill="url(#sx1)" />
                            </svg>
                          </div>
                          <button style={{ width: '100%', height: 44, background: '#E8C268', color: '#1A1612', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14 }}>Basvur &#8594;</button>
                        </div>
                      </div>
                    </div>

                    {/* Layer 2: Check-in QR */}
                    <div className="story-screen-layer" data-layer="2">
                      <div style={{ padding: '56px 20px 14px', background: '#1A1612' }}>
                        <div style={{ fontSize: 10, letterSpacing: '.16em', color: '#A89E8A', textTransform: 'uppercase', fontWeight: 700 }}>Check-in</div>
                        <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 20, color: '#F4EEDF', marginTop: 4 }}>QR&apos;i okut, basla</div>
                      </div>
                      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 220, height: 220, borderRadius: 16, background: '#F4EEDF', padding: 14, margin: '20px 0' }}>
                          <svg viewBox="0 0 60 60" width="100%" height="100%">
                            <rect width="60" height="60" fill="#F4EEDF" />
                            <g fill="#1A1612">
                              <rect x="4" y="4" width="14" height="14" /><rect x="8" y="8" width="6" height="6" fill="#F4EEDF" />
                              <rect x="42" y="4" width="14" height="14" /><rect x="46" y="8" width="6" height="6" fill="#F4EEDF" />
                              <rect x="4" y="42" width="14" height="14" /><rect x="8" y="46" width="6" height="6" fill="#F4EEDF" />
                              <rect x="24" y="6" width="3" height="3" /><rect x="30" y="6" width="3" height="3" /><rect x="36" y="6" width="3" height="3" />
                              <rect x="24" y="24" width="3" height="3" /><rect x="30" y="20" width="3" height="3" /><rect x="36" y="26" width="3" height="3" /><rect x="42" y="22" width="3" height="3" />
                              <rect x="24" y="36" width="3" height="3" /><rect x="30" y="42" width="3" height="3" /><rect x="36" y="38" width="3" height="3" /><rect x="42" y="44" width="3" height="3" />
                              <rect x="50" y="24" width="3" height="3" /><rect x="50" y="36" width="3" height="3" /><rect x="50" y="48" width="3" height="3" />
                            </g>
                          </svg>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#A89E8A', letterSpacing: '.08em' }}>iyibiri://checkin/kadikoy-kitap</div>
                      </div>
                    </div>

                    {/* Layer 3: Karma kazanildi */}
                    <div className="story-screen-layer" data-layer="3">
                      <div style={{ height: '100%', background: '#1A1612', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 20px 20px', textAlign: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 40%,rgba(232,194,104,.22),transparent 60%)', pointerEvents: 'none' }} />
                        <div style={{ position: 'relative', zIndex: 2 }}>
                          <svg width="120" height="120" viewBox="0 0 64 64" style={{ filter: 'drop-shadow(0 12px 40px rgba(232,194,104,.5))' }}>
                            <defs><radialGradient id="sx2" cx="40%" cy="36%" r="70%"><stop offset="0%" stopColor="#F4D98A" /><stop offset="55%" stopColor="#E8C268" /><stop offset="100%" stopColor="#B58F3D" /></radialGradient></defs>
                            <circle cx="32" cy="32" r="30" fill="url(#sx2)" />
                            <circle cx="32" cy="32" r="22" fill="none" stroke="#8A6A2C" strokeOpacity=".4" strokeWidth="0.6" />
                            <g transform="translate(32,32)"><circle cx="0" cy="-9" r="2.4" fill="#3E2F14" /><path d="M-3 -3 L-3 12 L3 12 L3 -3 Z" fill="#3E2F14" /><path d="M-6 12 L6 12 L6 10 L-6 10 Z" fill="#3E2F14" /></g>
                          </svg>
                          <div style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 48, color: '#E8C268', fontWeight: 500, letterSpacing: '-.03em', marginTop: 20 }}>+150</div>
                          <div style={{ fontSize: 10, letterSpacing: '.22em', color: '#A89E8A', textTransform: 'uppercase', fontWeight: 700, marginTop: 4 }}>Karma kazandin</div>
                          <div style={{ marginTop: 24, padding: '10px 14px', background: '#2E2923', border: '1px solid rgba(232,194,104,.16)', borderRadius: 10, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#A89E8A' }}>
                            <div style={{ color: '#6B8E4E', marginBottom: 2 }}>&#10003; Gorev dogrulandi</div>
                            <div style={{ color: '#E8C268' }}>Seviye: Cok Iyi Biri</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ETKI HIKAYELERI */}
      <section className="proof">
        <div className="wrap">
          <div className="sec-eyebrow">Etki</div>
          <h2 className="sec-title"><em>Her</em> gorev, <em>gercek</em> bir degisim.</h2>
          <p className="sec-lead">Gonullulerin tamamladigi her gorev, somut bir etki birakir. Iste son haftadan ornekler.</p>

          <div className="impact-grid">
            <div className="impact-card fade-in">
              <div className="impact-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80&auto=format&fit=crop)' }} />
              <div className="impact-body">
                <div className="impact-tag">Egitim</div>
                <h4>4.200 kitap, 8 koy okulu</h4>
                <p>Kadikoy&apos;de 12 gonullu bir araya geldi. Toplanan kitaplar siniflandirip kutulanarak koy okullarina gonderildi.</p>
                <div className="impact-stat">
                  <div>12<span>Gonullu</span></div>
                  <div>3s<span>Sure</span></div>
                  <div>+150<span>Karma</span></div>
                </div>
              </div>
            </div>

            <div className="impact-card fade-in">
              <div className="impact-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80&auto=format&fit=crop)' }} />
              <div className="impact-body">
                <div className="impact-tag">Cevre</div>
                <h4>Kilyos sahili yeniden temiz</h4>
                <p>TEMA Vakfi koordinasyonunda 28 gonullu, 340 kg atik topladi. Sahil yeniden yuzulebilir hale geldi.</p>
                <div className="impact-stat">
                  <div>28<span>Gonullu</span></div>
                  <div>4s<span>Sure</span></div>
                  <div>+200<span>Karma</span></div>
                </div>
              </div>
            </div>

            <div className="impact-card fade-in">
              <div className="impact-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80&auto=format&fit=crop)' }} />
              <div className="impact-body">
                <div className="impact-tag">Hayvanlar</div>
                <h4>120 sokak hayvani beslendi</h4>
                <p>Haytap ile birlikte 8 farkli noktada mama dagitimi yapildi. Duzgun beslenme, saglikli yasam.</p>
                <div className="impact-stat">
                  <div>8<span>Gonullu</span></div>
                  <div>2s<span>Sure</span></div>
                  <div>+100<span>Karma</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ODULLER */}
      <section className="rewards-section">
        <div className="wrap">
          <div className="sec-eyebrow">Oduller</div>
          <h2 className="sec-title">Karma biriktir, <em>gercek oduller</em> kazan.</h2>
          <p className="sec-lead">Her gorev Karma kazandirir. Biriktirdigin Karma&apos;yi sevdigin markalarda kullan.</p>

          <div className="rewards-grid">
            <div className="reward-card fade-in">
              <div className="reward-logo" style={{ background: '#1e3932' }}>&#9749;</div>
              <h5>Starbucks</h5>
              <div className="karma-cost">500 Karma</div>
              <div className="reward-desc">Ucretsiz icecek</div>
            </div>
            <div className="reward-card fade-in">
              <div className="reward-logo" style={{ background: '#ff6600', color: '#fff', fontSize: 16, fontWeight: 700 }}>M</div>
              <h5>Migros</h5>
              <div className="karma-cost">750 Karma</div>
              <div className="reward-desc">50 TL alisveris ceki</div>
            </div>
            <div className="reward-card fade-in">
              <div className="reward-logo" style={{ background: '#F5F5F5', color: '#111' }}>
                <svg width="28" height="10" viewBox="0 0 24 9" fill="currentColor"><path d="M24 0 H0 L4 9 H8 L6 4 H10 L12 9 H16 L14 4 H18 L24 0Z" /></svg>
              </div>
              <h5>Nike</h5>
              <div className="karma-cost">1.000 Karma</div>
              <div className="reward-desc">%20 indirim</div>
            </div>
            <div className="reward-card fade-in">
              <div className="reward-logo" style={{ background: '#F27A1A', color: '#fff', fontSize: 14, fontWeight: 700 }}>T</div>
              <h5>Trendyol</h5>
              <div className="karma-cost">600 Karma</div>
              <div className="reward-desc">30 TL kupon</div>
            </div>
            <div className="reward-card fade-in">
              <div className="reward-logo" style={{ background: '#00854d', color: '#fff', fontSize: 14, fontWeight: 700 }}>G</div>
              <h5>Garanti BBVA</h5>
              <div className="karma-cost">1.500 Karma</div>
              <div className="reward-desc">50 TL cashback</div>
            </div>
          </div>
        </div>
      </section>

      {/* NETWORK MAP */}
      <section className="network" id="stklar">
        <div className="wrap">
          <div className="sec-eyebrow">Ag</div>
          <h2 className="sec-title">81 sehirde, <em>248 STK.</em> <br />Turkiye&apos;nin gonulluluk agi.</h2>
          <canvas id="network-canvas" ref={networkCanvasRef} />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-final" id="manifesto">
        <div className="wrap">
          <h2><em>Iyilik</em> biriktirmeye<br />basla.</h2>
          <p className="p">30 saniyede hesap ac -- mahallendeki ilk gorevini bu hafta sec.</p>
          <div className="cta-row" style={{ justifyContent: 'center', opacity: 1 }}>
            <Link className="store-btn" href="/auth/login">
              <svg width="22" height="26" viewBox="0 0 24 28" fill="#F4EEDF"><path d="M17.05 20.28c-.98.95-2.05.86-3.08.4-1.09-.47-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25" /></svg>
              <div><div className="sm">Edin</div><div className="lg">App Store</div></div>
            </Link>
            <Link className="store-btn" href="/auth/login">
              <svg width="22" height="24" viewBox="0 0 24 26" fill="#F4EEDF"><path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893 2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198 2.807 1.626c.615.354.615 1.235 0 1.59l-2.808 1.626L15.212 12l2.486-2.491zM5.864 2.658 16.802 8.99l-2.302 2.302-8.636-8.635z" /></svg>
              <div><div className="sm">Edin</div><div className="lg">Google Play</div></div>
            </Link>
          </div>
          <div className="qr-row">
            <div className="qr">
              <svg viewBox="0 0 68 68" width="100%" height="100%">
                <rect x="0" y="0" width="68" height="68" fill="#F4EEDF" />
                <g fill="#1A1612">
                  <rect x="4" y="4" width="16" height="16" /><rect x="8" y="8" width="8" height="8" fill="#F4EEDF" />
                  <rect x="48" y="4" width="16" height="16" /><rect x="52" y="8" width="8" height="8" fill="#F4EEDF" />
                  <rect x="4" y="48" width="16" height="16" /><rect x="8" y="52" width="8" height="8" fill="#F4EEDF" />
                  <rect x="26" y="6" width="4" height="4" /><rect x="34" y="6" width="4" height="4" /><rect x="28" y="14" width="4" height="4" /><rect x="36" y="14" width="4" height="4" /><rect x="44" y="24" width="4" height="4" />
                  <rect x="26" y="22" width="4" height="4" /><rect x="34" y="22" width="4" height="4" /><rect x="42" y="30" width="4" height="4" /><rect x="50" y="30" width="4" height="4" />
                  <rect x="26" y="30" width="4" height="4" /><rect x="34" y="38" width="4" height="4" /><rect x="42" y="46" width="4" height="4" /><rect x="26" y="46" width="4" height="4" />
                  <rect x="34" y="54" width="4" height="4" /><rect x="42" y="54" width="4" height="4" /><rect x="50" y="46" width="4" height="4" /><rect x="50" y="54" width="4" height="4" />
                  <rect x="58" y="28" width="4" height="4" /><rect x="58" y="36" width="4" height="4" /><rect x="58" y="44" width="4" height="4" />
                </g>
              </svg>
            </div>
            <div className="txt"><div className="h">Telefonla okut</div><div className="s">QR&apos;i telefon kameranla tara -- magazaya git.</div></div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="g">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <svg width="28" height="28" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#24201B" /><circle cx="32" cy="32" r="28.5" fill="none" stroke="#E8C268" strokeWidth="1.2" strokeOpacity=".7" /><g transform="translate(32,32)"><rect x="-3" y="-4" width="6" height="18" rx="1" fill="#F4EEDF" /><rect x="-7" y="13" width="14" height="2.4" rx="1" fill="#F4EEDF" /><circle cx="0" cy="-11" r="4.2" fill="#E8C268" /></g></svg>
                <span style={{ fontFamily: "var(--font-display),'Fraunces',serif", fontSize: 20 }}>Iyi<em style={{ fontStyle: 'italic', color: '#E8C268' }}>Biri</em></span>
              </div>
              <p style={{ fontSize: 13, color: '#A89E8A', lineHeight: 1.6, maxWidth: 280 }}>Turkiye&apos;nin iyilik adresi. Gonullu ol, Karma biriktir, fark yarat.</p>
            </div>
            <div><h5>Urun</h5><ul><li><a href="#">Indir</a></li><li><a href="#">Nasil calisir</a></li><li><a href="#">STK&apos;lar</a></li><li><a href="#">Karma</a></li></ul></div>
            <div><h5>Kurum</h5><ul><li><a href="#">Hakkimizda</a></li><li><a href="#">Manifesto</a></li><li><a href="#">Basin</a></li><li><a href="#">Iletisim</a></li></ul></div>
            <div><h5>Topluluk</h5><ul><li><a href="#">Gonullu ol</a></li><li><a href="#">STK partneri ol</a></li><li><a href="#">Sikca sorulan sorular</a></li><li><a href="#">Destek</a></li></ul></div>
          </div>
          <div className="copy">
            <div>&copy; 2026 IyiBiri &middot; Karma Teknoloji A.S.</div>
            <div>KVKK &middot; Kullanim &middot; Cerezler</div>
          </div>
        </div>
      </footer>
    </>
  )
}
