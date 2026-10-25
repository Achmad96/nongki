package me.app.nongki.repository;

import jakarta.persistence.LockModeType;
import me.app.nongki.entity.SpaceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SpaceDetailRepository extends JpaRepository<SpaceDetail, String> {

  Optional<SpaceDetail> findByCode(String code);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT sd FROM SpaceDetail sd WHERE sd.code = :code")
  Optional<SpaceDetail> findByCodeWithLock(@Param("code") String code);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT sd FROM SpaceDetail sd WHERE sd.code IN :codes ORDER BY sd.code ASC")
  List<SpaceDetail> findAllByCodeInWithLock(@Param("codes") List<String> codes);
}

