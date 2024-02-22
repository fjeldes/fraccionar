import { ComponentType, HTMLAttributes, JSX } from "react";

interface Props {
  children?: any;
}

const Container = ({ children }: Props) => {
  return (
    <div className="container max-w-screen-lg px-10 md:px-20 py-20 self-center">
      {children}
    </div>
  );
};

export default Container;
