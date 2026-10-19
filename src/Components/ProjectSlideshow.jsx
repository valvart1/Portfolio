import { useState } from "react";

export default function ProjectSlideshow( { images, title }) {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent(i => (i === 0 ? images.length - 1 : i -1));
    const next = () => setCurrent(i => (i === images.length - 1 ? 0 : i + 1));

    return (
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', borderRadius: '4px', overflow: 'hidden', background: 'var(--surface)' }}>

            <img 
                src={images[current]}
                alt={`${title} screenshot ${current + 1}`}
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
      />

      {images.length > 1 && (
        <>
          {/* Prev button */}
          <button onClick={prev} style={{
            position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(248,246,241,0.85)', border: 'none', borderRadius: '2px',
            width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
            color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>←</button>

          {/* Next button */}
          <button onClick={next} style={{
            position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(248,246,241,0.85)', border: 'none', borderRadius: '2px',
            width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px',
            color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>→</button>

          {/* Dots */}
          <div style={{
            position: 'absolute', bottom: '12px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '6px'
          }}>
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} style={{
                width: '6px', height: '6px', borderRadius: '50%', border: 'none',
                background: i === current ? 'var(--accent)' : 'var(--border)',
                cursor: 'pointer', padding: 0
              }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
