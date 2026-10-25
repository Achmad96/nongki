package me.app.nongki.repository;

import jakarta.validation.constraints.NotNull;
import me.app.nongki.entity.Space;
import me.app.nongki.entity.SpaceDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface SpaceRepository extends JpaRepository<Space, String>, JpaSpecificationExecutor<Space> {

  /**
   * Finds a space by its ID.
   *
   * @param id the ID of the space to find
   * @return the Space object if found, otherwise null
   */
  @Override
  default Optional<Space> findById(@NotNull String id) {
    return findAll().stream()
      .filter(space -> space.getId().equals(id))
      .findFirst();
  }

  /**
   * Finds a space detail by its code.
   *
   * @param code the code of the space detail to find
   * @return an Optional containing the SpaceDetail if found, otherwise empty
   */
  default Optional<SpaceDetail> findDetailByCode(@NotNull String code) {
    return findAll().stream()
      .flatMap(space -> space.getSpaceDetails().stream())
      .filter(detail -> detail.getCode().equals(code))
      .findFirst();
  }
}
