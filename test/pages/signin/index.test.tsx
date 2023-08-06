import "@testing-library/jest-dom";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { enableFetchMocks } from "jest-fetch-mock";
import { supabase } from "@/query/supabaseClient";
import Signin from "@/pages/signin/index";

enableFetchMocks();

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/query/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn().mockReturnValue({ data: {} }),
      signOut: jest.fn(),
    },
  },
}));

jest.mock("@/components/shared", () => ({
  __esModule: true,
  LoadingSpinner: jest.fn().mockReturnValue(<div>MockedLoading</div>),
}));

describe("Signin page testing", () => {
  const mockRouterPush = jest.fn();
  beforeEach(() => {
    require("next/router").useRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("render without crashing", () => {
    render(<Signin email={null} providers={null} />);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("call handleOAuthSignin on button click", async () => {
    render(<Signin email={null} providers={null} />);

    const button = screen.getByRole("button", { name: /discord/i });

    await act(async () => {
      fireEvent.click(button);
    });

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalled();
  });
});
