import { ManageProfileService } from '@/services/ManageProfileService';
import { updateDoc, getDoc } from 'firebase/firestore';
import { deleteObject } from 'firebase/storage';
import { uploadImageToFirebase } from '../util/uploadImage';

jest.mock('@/firebase-service');
jest.mock('../util/uploadImage');

jest.mock('firebase/firestore', () => ({
  getDoc: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn()
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  deleteObject: jest.fn()
}));

uploadImageToFirebase.mockResolvedValue({
  downloadURL: 'mockAvatarUrl',
  imagePath: 'mockAvatarPath'
});

const mockUser = { uid: 'testUserId' };
const service = new ManageProfileService(mockUser);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ManageProfileService', () => {
  it('successfully updates the user biography', async () => {
    const newBiography = 'New biography content';
    updateDoc.mockResolvedValueOnce({});

    const result = await service.updateBiography(newBiography);
    expect(updateDoc).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(result.message).toBe('Biography updated successfully!');
  });

  it('fails to update biography when it is too long', async () => {
    const longBiography = 'a'.repeat(MAX_BIO_LENGTH + 1);

    const result = await service.updateBiography(longBiography);
    expect(result.success).toBeFalsy();
    expect(result.message).toContain('Error: Biography too long');
  });

  it('successfully updates the user avatar', async () => {
    const mockFile = new Blob(['avatar'], { type: 'image/jpeg' });
    getDoc.mockResolvedValueOnce({ exists: () => true, data: () => ({ avatarPath: 'old/path' }) });

    const result = await service.updateAvatar(mockFile, () => { });
    expect(deleteObject).toHaveBeenCalled();
    expect(uploadImageToFirebase).toHaveBeenCalledWith(mockFile, 'avatars', expect.any(Function));
    expect(updateDoc).toHaveBeenCalled();
    expect(result.success).toBeTruthy();
    expect(result.avatarUrl).toBe('mockAvatarUrl');
  });

  it('handles failure when updating the avatar', async () => {
    const mockFile = new Blob(['avatar'], { type: 'image/jpeg' });
    uploadImageToFirebase.mockRejectedValueOnce(new Error('Upload failed'));

    const result = await service.updateAvatar(mockFile, () => { });
    expect(result.success).toBeFalsy();
    expect(result.message).toContain('An error occurred');
  });
});
