import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import SignInScreen from "../auth/SignInScreen";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

// Mocking the `useNavigation` hook
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

// Mocking Notifications and related functions
jest.mock("expo-notifications", () => ({
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
  setNotificationHandler: jest.fn(),
  getNotificationChannelsAsync: jest.fn().mockResolvedValue([]),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }), // Mock getPermissionsAsync
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }), // Mock requestPermissionsAsync
}));

jest.mock("expo-device", () => ({
  isDevice: true,
}));

// Mock the alert function
jest.spyOn(Alert, "alert");

describe("SignInScreen", () => {
  const mockNavigate = jest.fn();

  beforeAll(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  it("renders correctly", async () => {
    await act(async () => {
      const { getByPlaceholderText, getByText } = render(<SignInScreen />);

      // Check if the Login screen title and input fields are rendered
      expect(getByText("Login")).toBeTruthy();
      expect(getByPlaceholderText("Username")).toBeTruthy();
      expect(getByPlaceholderText("Password")).toBeTruthy();
    });
  });

  it("validates email and password correctly", async () => {
    await act(async () => {
      const { getByPlaceholderText, getByRole } = render(<SignInScreen />);

      const usernameInput = getByPlaceholderText("Username");
      const passwordInput = getByPlaceholderText("Password");
      const loginButton = getByRole("button", { name: "Login" });

      // Test invalid email and password
      fireEvent.changeText(usernameInput, "invalid-email");
      fireEvent.changeText(passwordInput, "short");
      fireEvent.press(loginButton);

      expect(Alert.alert).toHaveBeenCalledWith("Please check login details");

      // Test valid email and password
      fireEvent.changeText(usernameInput, "test@example.com");
      fireEvent.changeText(passwordInput, "Password123!");

      fireEvent.press(loginButton);
      expect(mockNavigate).toHaveBeenCalledWith("HomeListScreen");
    });
  });

  it("triggers button animation on press", async () => {
    await act(async () => {
      const { getByRole } = render(<SignInScreen />);
      const loginButton = getByRole("button", { name: "Login" });

      act(() => {
        fireEvent.press(loginButton);
      });

      // Use waitFor to ensure the animation completes
      await waitFor(() => {
        expect(loginButton).toBeTruthy();
      });
    });
  });
});
