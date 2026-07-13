import type { ReactNode } from "react";

type AdaptadoMobilProps = {
  children: ReactNode;
  estilos?: string;
};

function AdaptadoMobil({ children, estilos = "" }: AdaptadoMobilProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <div
        className="h-screen overflow-x-hidden overflow-y-auto border-4 border-black bg-[#dbeee8] p-0 font-[Arial]"
        style={{
          width: "30vw",
          minWidth: "400px",/*360  */
          maxWidth: "500px",/*430  */
          wordBreak: "break-all",
          overflowWrap: "anywhere",
          whiteSpace: "normal",
        }}
      >
        <div className={`flex w-full min-w-0 flex-col ${estilos}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdaptadoMobil;
