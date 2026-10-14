import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";
import { Header } from "@/components/layout/Header";
const api = vi.hoisted(() => ({fetchJSON: vi.fn()}));
vi.mock("@/lib/api", () => api);
afterEach(cleanup);
function openSearch() {
  render(<QueryClientProvider client={new QueryClient({defaultOptions:{queries:{retry:false}}})}><MemoryRouter><Header /></MemoryRouter></QueryClientProvider>);
  fireEvent.click(screen.getByRole("button", {name:"Search site"}));
  return screen.getByLabelText("Search the website");
}
it("debounces record searches and displays actual record destinations", async () => {
  api.fetchJSON.mockResolvedValue({results:[{kind:"Publications",title:"Needle sensor study",href:"/research/publications#needle",summary:"Author A"}]});
  const input=openSearch(); fireEvent.change(input,{target:{value:"Needle sensor"}});
  expect(api.fetchJSON).not.toHaveBeenCalled();
  const result=await screen.findByRole("link",{name:"Needle sensor study"});
  expect(result).toHaveAttribute("href","/research/publications#needle");
  expect(api.fetchJSON).toHaveBeenCalledWith("/api/core/search/?q=needle%20sensor");
  fireEvent.keyDown(input,{key:"Escape"});
  expect(screen.getByRole("button",{name:"Search site"})).toHaveFocus();
});
it("retains matching page links and retry when record search fails", async () => {
  api.fetchJSON.mockRejectedValue(new Error("Unavailable"));
  fireEvent.change(openSearch(),{target:{value:"thesis"}});
  await screen.findByText("Department records could not be searched.");
  expect(within(screen.getByRole("search")).getByRole("link",{name:"Thesis Process Guide"})).toHaveAttribute("href","/thesis-guide");
  expect(screen.getByRole("button",{name:"Try searching records again"})).toBeInTheDocument();
});

it("keeps large result sets compact and expands them on request", async () => {
  api.fetchJSON.mockResolvedValue({results:Array.from({length:8}, (_,id)=>({kind:"Publications", title:`Needle paper ${id}`, href:`/research/publications#needle-${id}`, summary:""}))});
  fireEvent.change(openSearch(),{target:{value:"needle"}});
  await screen.findByRole("link",{name:"Needle paper 0"});
  expect(screen.queryByRole("link",{name:"Needle paper 7"})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Show more department records"}));
  expect(screen.getByRole("link",{name:"Needle paper 7"})).toBeInTheDocument();
});
