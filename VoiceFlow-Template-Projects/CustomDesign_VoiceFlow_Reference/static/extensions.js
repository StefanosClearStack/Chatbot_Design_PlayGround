export const CalendlyExtension = {
  name: "Calendly",
  type: "effect",
  match: ({ trace }) => {
    return (
      trace.type === "ext_calendly" || trace.payload.name === "ext_calendly"
    );
  },
  effect: ({ trace }) => {
    const { url } = trace.payload;
    if (url) {
      Calendly.initPopupWidget({url: 'https://calendly.com/stefanos-clearstack/demo'});
    }
  },
};

