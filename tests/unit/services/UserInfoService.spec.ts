import { UserInfoService } from '@/services/UserInfoService';
import { firebaseAuth, db } from "@/firebase-service";
import { doc, getDoc } from "firebase/firestore";

jest.mock('@/firebase-service');
jest.mock("firebase/firestore", () => ({
  getDoc: jest.fn(),
  doc: jest.fn()
}));

describe('UserInfoService', () => {
  it('gets current user username successfully', async () => {
    const mockUsername = 'testUser';
    firebaseAuth.currentUser = { uid: 'user1' };
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ username: mockUsername })
    });

    const service = new UserInfoService();
    const result = await service.getCurrentUserUsername();
    expect(getDoc).toHaveBeenCalled();
    expect(result).toBe(mockUsername);
  });

  it('returns empty when user document does not exist', async () => {
    firebaseAuth.currentUser = { uid: 'user1' };
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });

    const service = new UserInfoService();
    const result = await service.getCurrentUserUsername();
    expect(getDoc).toHaveBeenCalled();
    expect(result).toBe('');
  });

  it('fetches user data successfully', async () => {
    const mockUserData = { username: 'testUser', email: 'test@example.com' };
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockUserData
    });

    const service = new UserInfoService();
    const result = await service.fetchUserData('user1');
    expect(getDoc).toHaveBeenCalled();
    expect(result).toEqual(mockUserData);
  });

  it('returns null when user document does not exist', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => false
    });

    const service = new UserInfoService();
    const result = await service.fetchUserData('user1');
    expect(getDoc).toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
