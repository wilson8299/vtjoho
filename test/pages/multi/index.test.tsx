import "@testing-library/jest-dom";
import { render, fireEvent, screen } from "@testing-library/react";
import { enableFetchMocks } from "jest-fetch-mock";
import Multi from "@/pages/multi/index";

enableFetchMocks();

jest.mock("/node_modules/react-grid-layout/css/styles.css", () => jest.fn());
jest.mock("/node_modules/react-resizable/css/styles.css", () => jest.fn());
jest.mock("swiper/css", () => jest.fn());
jest.mock("swiper/css/free-mode", () => jest.fn());
jest.mock("react-tooltip/dist/react-tooltip.css", () => jest.fn());

jest.mock("react-modal", () => ({
  setAppElement: jest.fn(),
}));

jest.mock("@/components/specific/multi/MultiModal", () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(<div>MockedMultiModal</div>),
}));

jest.mock("@/query/supabaseClient", () => jest.fn());

jest.mock("@/query/vidoeQuery", () => ({
  useGetThreeDayLiveVideoQuery: () => ({
    data: [],
    isLoading: false,
    isRefetching: false,
    refetch: jest.fn(),
  }),
}));

jest.mock("@/query/agencyQuery", () => ({
  useAgencyQuery: () => ({
    data: [],
    isLoading: false,
  }),
}));

describe("Multi component testing", () => {
  it("check if the 'Add View' button performs correctly.", () => {
    const { container } = render(<Multi />);
    const gridCOntainer = container.getElementsByClassName("react-grid-layout")[0];

    expect(gridCOntainer).toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId("add-view"));

    expect(gridCOntainer).not.toBeEmptyDOMElement();
  });

  it("check if the 'Remove All' button performs correctly.", () => {
    const { container } = render(<Multi />);
    const gridCOntainer = container.getElementsByClassName("react-grid-layout")[0];
    const addViewButton = screen.getByTestId("add-view");

    fireEvent.click(addViewButton);
    fireEvent.click(addViewButton);

    expect(gridCOntainer).not.toBeEmptyDOMElement();

    fireEvent.click(screen.getByTestId("remove-all"));

    expect(gridCOntainer).toBeEmptyDOMElement();
  });
});
