package com.finance.finance.modules.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.finance.finance.modules.usuario.model.Usuario;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

  private final Key key;
  private final long accessTtlMillis;

  public JwtService(@Value("${jwt.secret}") String secret,
      @Value("${jwt.access-ttl-minutes}") long accessTtlMinutes) {
    this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    this.accessTtlMillis = accessTtlMinutes * 60_000L;
  }

  public String gerarAccessToken(Usuario usuario) {
    Date agora = new Date();
    return Jwts.builder()
        .setSubject(usuario.getId().toString())
        .claim("email", usuario.getEmail())
        .claim("role", usuario.getPerfil().name())
        .setIssuedAt(agora)
        .setExpiration(new Date(agora.getTime() + accessTtlMillis))
        .signWith(key, SignatureAlgorithm.HS256)
        .compact();
  }

  public Jws<Claims> validar(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
  }
}