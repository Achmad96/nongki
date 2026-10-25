package me.app.nongki.service;

import me.app.nongki.criteria.SpaceCriteria;
import me.app.nongki.entity.Space;
import me.app.nongki.exception.ResourceNotFoundException;
import me.app.nongki.repository.SpaceRepository;
import me.app.nongki.specification.SpaceSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpaceService {

  private static final Logger log = LoggerFactory.getLogger(SpaceService.class);

  private final SpaceRepository spaceRepository;

  @Autowired
  public SpaceService(SpaceRepository spaceRepository) {
    this.spaceRepository = spaceRepository;
  }

  public List<Space> getSpaces(String categoryId, String type, String date, Integer startTime, Integer endTime) {
    if (startTime != null && endTime != null && startTime >= endTime) {
      log.warn("Start Time: {} can't be greater or equal to End Time: {}", startTime, endTime);
      throw new IllegalArgumentException("Start Time cannot be greater or equals to End Time");
    }

    final SpaceCriteria criteria = new SpaceCriteria(categoryId, type, date, startTime, endTime);
    final Specification<Space> specification = new SpaceSpecification(criteria);
    return spaceRepository.findAll(specification);
  }

  public List<Space> getAllSpaces() {
    return spaceRepository.findAll();
  }

  public Space getSpaceById(String id) {
    return spaceRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("Space not found with id: " + id));
  }

  public Space createSpace(Space space) {
    if (space.getCategory() == null || space.getType() == null || space.getPrice() <= 0) {
      log.warn("Invalid space data: {}", space);
      throw new IllegalArgumentException("Invalid space data");
    }
    return spaceRepository.save(space);
  }
}
