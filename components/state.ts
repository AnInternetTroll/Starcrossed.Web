import { useState } from "react";
import { createContainer } from "react-tracked";

export interface State {
	token?: string;
	basic?: string;
	theme?: "dark_theme" | "light_theme";
	user?: any;
}

const initialState: State = {
	theme: "light_theme",
};

const useValue = () => useState(initialState);

export const { Provider, useTracked } = createContainer(useValue);
