export {};

declare global {
  interface AlternativaReconocimientoVoz {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface ResultadoReconocimientoVoz {
    readonly isFinal: boolean;
    readonly length: number;
    readonly [indice: number]: AlternativaReconocimientoVoz;
  }

  interface ListaResultadosReconocimientoVoz {
    readonly length: number;
    readonly [indice: number]: ResultadoReconocimientoVoz;
  }

  interface EventoResultadoReconocimientoVoz extends Event {
    readonly resultIndex: number;
    readonly results: ListaResultadosReconocimientoVoz;
  }

  interface EventoErrorReconocimientoVoz extends Event {
    readonly error: string;
    readonly message?: string;
  }

  interface ReconocimientoVozNavegador {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onstart: ((evento: Event) => void) | null;
    onresult: ((evento: EventoResultadoReconocimientoVoz) => void) | null;
    onerror: ((evento: EventoErrorReconocimientoVoz) => void) | null;
    onend: ((evento: Event) => void) | null;
    start(): void;
    stop(): void;
    abort(): void;
  }

  interface ConstructorReconocimientoVoz {
    new (): ReconocimientoVozNavegador;
  }

  interface Window {
    SpeechRecognition?: ConstructorReconocimientoVoz;
    webkitSpeechRecognition?: ConstructorReconocimientoVoz;
  }
}
