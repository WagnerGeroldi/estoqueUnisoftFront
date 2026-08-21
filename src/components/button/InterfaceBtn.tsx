import { ReactNode } from "react";

export interface IButton {
  content: ReactNode;
  link: string;
  contentBtnPrimary: string | any;
  contentBtnSecondary: string;
}
