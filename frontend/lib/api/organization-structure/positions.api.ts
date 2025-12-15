import api from "../client";
import {
  CreatePositionDto,
  UpdatePositionDto,
  PositionResponseDto,
  PositionHierarchyNode,
  GetPositionsParams,
} from "../../../types/organization-structure";

export const positionsApi = {
  /**
   * REQ-OSM-01: Create new position (System Admin only)
   * BR 10: Position must have Position ID, Pay Grade, Dept ID
   * BR 30: Creation requires Cost Center and Reporting Manager
   */
  createPosition: async (
    data: CreatePositionDto
  ): Promise<PositionResponseDto> => {
    try {
      console.log("Creating position:", data);
      const response: PositionResponseDto = await api.post(
        "/organization-structure/positions",
        data
      );
      return response;
    } catch (error) {
      console.error("Error creating position:", error);
      throw error;
    }
  },

  /**
   * REQ-SANV-01: View positions (All authenticated users)
   */
  getAllPositions: async (
    params?: GetPositionsParams
  ): Promise<PositionResponseDto[]> => {
    try {
      console.log("Fetching positions with params:", params);
      const queryParams = new URLSearchParams();

      if (params?.departmentId) {
        queryParams.append("departmentId", params.departmentId);
      }
      if (params?.isActive !== undefined) {
        queryParams.append("isActive", params.isActive.toString());
      }

      const url = `/organization-structure/positions${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;
      const response: PositionResponseDto[] = await api.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching positions:", error);
      throw error;
    }
  },

  /**
   * REQ-SANV-01: View specific position details
   */
  getPositionById: async (id: string): Promise<PositionResponseDto> => {
    try {
      console.log("Fetching position by ID:", id);
      const response: PositionResponseDto = await api.get(
        `/organization-structure/positions/${id}`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching position ${id}:`, error);
      throw error;
    }
  },

  /**
   * REQ-OSM-02: Update existing position (System Admin only)
   */
  updatePosition: async (
    id: string,
    data: UpdatePositionDto
  ): Promise<PositionResponseDto> => {
    try {
      console.log(`Updating position ${id}:`, data);
      const response: PositionResponseDto = await api.put(
        `/organization-structure/positions/${id}`,
        data
      );
      return response;
    } catch (error) {
      console.error(`Error updating position ${id}:`, error);
      throw error;
    }
  },

  /**
   * REQ-OSM-05: Deactivate position (System Admin only)
   * BR 12, BR 16, BR 37: Historical records preserved, status Frozen/Inactive
   */
  deactivatePosition: async (id: string): Promise<PositionResponseDto> => {
    try {
      console.log(`Deactivating position ${id}`);
      const response: PositionResponseDto = await api.delete(
        `/organization-structure/positions/${id}`
      );
      return response;
    } catch (error) {
      console.error(`Error deactivating position ${id}:`, error);
      throw error;
    }
  },

  /**
   * REQ-SANV-01: View position hierarchy
   * BR 24: View as graphical chart
   */
  getPositionHierarchy: async (id: string): Promise<PositionHierarchyNode> => {
    try {
      console.log(`Fetching position hierarchy for position ${id}`);
      const response: PositionHierarchyNode = await api.get(
        `/organization-structure/positions/${id}/hierarchy`
      );
      return response;
    } catch (error) {
      console.error(`Error fetching position hierarchy ${id}:`, error);
      throw error;
    }
  },
};
