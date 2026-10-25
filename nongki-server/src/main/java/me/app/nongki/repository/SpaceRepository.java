package me.app.nongki.repository;

import me.app.nongki.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpaceRepository extends JpaRepository<Space, String>, JpaSpecificationExecutor<Space> {

  List<Space> findByType(String type);
}
