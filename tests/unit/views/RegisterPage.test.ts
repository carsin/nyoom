import { mount } from '@vue/test-utils';
import RegisterPage from '@/views/RegisterPage.vue';
import { firebaseAuth, db } from "@/firebase-service";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getDocs, setDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';

jest.mock('@/firebase-service');
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  sendEmailVerification: jest.fn()
}));

jest.mock("firebase/firestore", () => ({
  getDocs: jest.fn(),
  setDoc: jest.fn()
}));

const mockRouter = {
  push: jest.fn()
};
jest.mock('vue-router', () => ({
  useRouter: () => mockRouter
}));

const createComponent = (props = {}) => {
  return mount(RegisterPage, {
    props: { ...props },
    global: {
      mocks: {
        firebaseAuth,
        db,
        useRouter: () => mockRouter
      }
    }
  });
};

describe('RegisterPage', () => {
  it('validates user inputs correctly', async () => {
    const wrapper = createComponent();
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.emailError).toBe('Email is required');
    expect(wrapper.vm.usernameError).toBe('Username is required');
    expect(wrapper.vm.passwordError).toBe('Password is required');
    expect(wrapper.vm.confirmPasswordError).toBe('Password confirmation is required');
  });

  it('checks if username is already taken', async () => {
    getDocs.mockResolvedValueOnce({ empty: false }); // Username already exists

    const wrapper = createComponent();
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.usernameError).toBe('Username is already taken. Please choose another one');
  });

  it('registers a new user successfully', async () => {
    getDocs.mockResolvedValueOnce({ empty: true }); // Username is available
    createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: 'testUid' } });
    sendEmailVerification.mockResolvedValueOnce({});

    const wrapper = createComponent();
    await wrapper.find('form').trigger('submit.prevent');

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(sendEmailVerification).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalled();
    expect(wrapper.vm.toast.isOpen).toBeTruthy();
    expect(mockRouter.push).toHaveBeenCalledWith("/verify-email");
  });

  it('handles registration with an existing email', async () => {
    createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });

    const wrapper = createComponent();
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.vm.emailError).toBe('The email address is already in use');
    expect(wrapper.vm.toast.isOpen).toBeTruthy();
  });
});
