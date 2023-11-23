import { ManageGarageService } from '@/services/ManageGarageService';
import { firebaseAuth, db, storage } from "@/firebase-service";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

jest.mock('@/firebase-service');
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn()
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  deleteObject: jest.fn()
}));

const mockUser = { uid: "testUserId" };
const service = new ManageGarageService(mockUser);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ManageGarageService', () => {
  it('updates the vehicle description', async () => {
    const vehicleRef = {}; // Mock vehicle reference
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ userId: mockUser.uid }) });
    updateDoc.mockResolvedValueOnce({});

    const result = await service.updateDescription("userId", "vehicleId", "New description", "Old description");
    expect(updateDoc).toHaveBeenCalledWith(vehicleRef, { description: "New description" });
    expect(result.success).toBeTruthy();
  });

  it('deletes a vehicle', async () => {
    const vehicleRef = {}; // Mock vehicle reference
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ imageUrl: "imageURL" }) });
    deleteDoc.mockResolvedValueOnce({});
    deleteObject.mockResolvedValueOnce({});

    const result = await service.deleteVehicle("vehicleId", "userId");
    expect(deleteDoc).toHaveBeenCalledWith(vehicleRef);
    expect(deleteObject).toHaveBeenCalledWith(storageRef(storage, "imageURL"));
    expect(result.success).toBeTruthy();
  });

  it('compares two maps correctly', () => {
    const map1 = new Map([["key1", "value1"], ["key2", "value2"]]);
    const map2 = new Map([["key1", "value1"], ["key2", "value2"]]);

    const result = service.areMapsEqual(map1, map2);
    expect(result).toBeTruthy();
  });

  it('updates the vehicle modifications', async () => {
    const vehicleRef = {}; // Mock vehicle reference
    const newMods = new Map([["mod1", "value1"], ["mod2", "value2"]]);
    const oldMods = new Map([["mod1", "value1"]]);
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ userId: mockUser.uid }) });
    updateDoc.mockResolvedValueOnce({});

    const result = await service.updateMods("userId", "vehicleId", newMods, oldMods);
    expect(updateDoc).toHaveBeenCalledWith(vehicleRef, { carMods: newMods });
    expect(result.success).toBeTruthy();
  });
});
