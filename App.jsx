import React from 'react';

const Bio = () => {
  const user = {
    alias: "towerholl",
    bio: "Tech enthusiast and creative builder. Passionate about web development, open-source, and digital design.",
    skills: [ "C#/C++", "UI/UX", "Godot"],
    links: [
      { name: "Tiktok", url: "#" },
      { name: "Telegram-channel", url: "#" }
    ]
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0f0f0f', 
      color: '#ffffff',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        {/* Avatar Placeholder */}
        <div style={{ 
          width: 120, height: 120, 
          borderRadius: '50%', 
          background: '#333', 
          margin: '0 auto 1.5rem' 
        }} />

        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          {user.alias}
        </h1>
        
        <p style={{ fontSize: '1.1rem', color: '#aaa', lineHeight: 1.6 }}>
          {user.bio}
        </p>

        {/* Skills Tags */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', margin: '1.5rem 0' }}>
          {user.skills.map(skill => (
            <span key={skill} style={{ 
              padding: '0.4rem 1rem', 
              background: '#222', 
              borderRadius: '999px', 
              fontSize: '0.85rem',
              border: '1px solid #333'
            }}>
              {skill}
            </span>
          ))}
        </div>

        {/* Social Links */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user.links.map(link => (
            <a key={link.name} href={link.url} style={{ 
              color: '#fff', 
              textDecoration: 'none',
              padding: '0.6rem 1.5rem',
              border: '1px solid #444',
              borderRadius: '8px',
              transition: 'all 0.2s'
            }}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bio;