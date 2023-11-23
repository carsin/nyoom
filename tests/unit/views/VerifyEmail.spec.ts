import { mount } from '@vue/test-utils';
import VerifyEmail from '@/views/VerifyEmail.vue';
import { firebaseAuth } from '@/firebase-service';
import { sendEmailVerification, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';

jest.mock('@/firebase-service');
jest.mock('firebase/auth', () => ({
  sendEmailVerification: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn().mockImplementation((auth, callback) => callback({ emailVerified: true }))
}));

const mockRouter = {
  push: jest.fn(),
  currentRoute: {
    value: { path: '/verify-email' }
  }
};
useRouter.mockReturnValue(mockRouter);

const mountVerifyEmail = () => {
  return mount(VerifyEmail, {
    global: {
      mocks: {
        useRouter: mockRouter,
        firebaseAuth
      }
    }
  });
};

firebaseAuth.currentUser = {
  reload: jest.fn(),
  emailVerified: false
};

describe('VerifyEmail', () => {
  it('sends a verification email when button is clicked', async () => {
    const wrapper = mountVerifyEmail();
    await wrapper.find('ion-button').trigger('click');
    expect(sendEmailVerification).toHaveBeenCalledWith(firebaseAuth.currentUser);
  });


  it('handles logout correctly', async () => {
    const wrapper = mountVerifyEmail();
    await wrapper.find('.logout-button').trigger('click');
    expect(signOut).toHaveBeenCalledWith(firebaseAuth);
    expect(mockRouter.push).toHaveBeenCalledWith('/onboard');
  });

  it('redirects to feed if user is verified', async () => {
    firebaseAuth.currentUser.emailVerified = true;
    mountVerifyEmail();
    expect(mockRouter.push).toHaveBeenCalledWith('/feed');
  });

  it('enables the send button after cooldown', async () => {
    jest.useFakeTimers();
    const wrapper = mountVerifyEmail();
    jest.advanceTimersByTime(60000); // Advance time by 60 seconds
    await wrapper.vm.$nextTick();
    expect(wrapper.find('ion-button').attributes('disabled')).toBeFalsy();
    jest.useRealTimers();
  });
});

