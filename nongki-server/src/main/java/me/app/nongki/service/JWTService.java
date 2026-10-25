package me.app.nongki.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JWTService {

  @Value("${security.jwt.secret-key}")
  private String secretKey;

  @Value("${security.jwt.expiration-time}")
  private long TOKEN_VALIDITY;

  private volatile SecretKey cachedSignInKey;

  public String generateToken(String email) {
    final Map<String, Object> claims = new HashMap<>();
    return createToken(claims, email);
  }

  private String createToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
      .claims(claims)
      .subject(subject)
      .issuedAt(new Date(System.currentTimeMillis()))
      .expiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
      .signWith(getSignInKey())
      .compact();
  }

  public Boolean validateToken(String token, UserDetails userDetails) {
    final String email = extractEmail(token);
    return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
  }

  public String extractEmail(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  private Claims extractAllClaims(String token) {
    return Jwts.parser()
      .verifyWith(getSignInKey())
      .build()
      .parseSignedClaims(token)
      .getPayload();
  }

  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private SecretKey getSignInKey() {
    if (cachedSignInKey == null) {
      synchronized (this) {
        if (cachedSignInKey == null) {
          final byte[] keyBytes = Decoders.BASE64.decode(secretKey);
          cachedSignInKey = Keys.hmacShaKeyFor(keyBytes);
        }
      }
    }
    return cachedSignInKey;
  }
}
