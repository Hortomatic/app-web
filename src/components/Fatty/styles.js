export default {
  "Fatty-Sheet": {
    "paddingTop": 1,
    "paddingRight": 1,
    "paddingBottom": 1,
    "paddingLeft": 1
  },
  "Fatty-Field": {
    "position": "relative",
    "marginTop": 2,
    "marginRight": 0,
    "marginBottom": 2,
    "marginLeft": 0,
    "paddingTop": 0,
    "paddingRight": 0,
    "paddingBottom": 0,
    "paddingLeft": 0,
    "transition": "margin-top .3s  linear",
    "background": "#FFF"
  },
  "Fatty-Field:focus": {
    "outline": "none"
  },
  "Fatty-Field--filled": {},
  "Fatty-Field--focused": {
    "color": "#fff"
  },
  "Fatty-Field:hover": {},
  "Fatty-Field-label": {
    "position": "absolute",
    "zIndex": 3,
    "top": 0,
    "right": 0,
    "bottom": 0,
    "left": 0,
    "marginTop": 0,
    "marginRight": 0,
    "marginBottom": 0,
    "marginLeft": 0,
    "paddingTop": 0.85,
    "paddingRight": 0.45,
    "paddingBottom": 0.85,
    "paddingLeft": 0.45,
    "userSelect": "none",
    "color": "#818076",
    "WebkitTouchCallout": "none",
    "transition": "transform .3s .1s cubic-bezier(.68, -.55, .27, 1.55), color .1s ease-in-out"
  },
  "Fatty-Field--focused Fatty-Field-label": {
    "color": "#fff",
    "transform": "translate(0, -.3em)"
  },
  "Fatty-Field-controlWrapper": {
    "position": "relative",
    "zIndex": 4,
    "minHeight": 50
  },
  "Fatty-Field--focused Fatty-Field-controlWrapper": {
    "color": "#fff"
  },
  "Fatty-Field-background": {
    "position": "absolute",
    "zIndex": 1,
    "top": 0,
    "left": 0,
    "width": "100%",
    "height": "100%",
    "pointerEvents": "none",
    "bottom": 0,
    "content": "''",
    "transition": "transform .3s cubic-bezier(.68, -.55, .27, 1.55)",
    "transform": "scale(1, 0)",
    "transformOrigin": "0 100%",
    "backgroundColor": "#44b9f0"
  },
  "Fatty-Field-label-text": {
    "transition": "transform .3s .1s cubic-bezier(.68, -.55, .27, 1.55), color .1s ease-in-out"
  },
  "Fatty-Field-hint": {
    "fontSize": 14,
    "position": "absolute",
    "zIndex": 2,
    "right": 0,
    "paddingTop": 0.85,
    "paddingRight": 0.85,
    "paddingBottom": 0.85,
    "paddingLeft": 0.85,
    "transition": "opacity .2s ease-in-out, color .2s ease-in-out",
    "textAlign": "right",
    "opacity": 1
  },
  "Fatty-Field--focused Fatty-Field-hint": {
    "color": "#fff"
  },
  "Fatty-Field--filled Fatty-Field-hint": {
    "opacity": 0
  },
  "Fatty-Field-help": {
    "position": "relative",
    "float": "right",
    "transition": "opacity .1s ease-in-out",
    "opacity": 0
  },
  "Fatty-Field--focused Fatty-Field-help": {
    "opacity": 1
  },
  "Fatty-Field--focused Fatty-Field-help-icon": {
    "cursor": "help"
  },
  "Fatty-Field-help-bubble": {
    "fontSize": 16,
    "position": "absolute",
    "zIndex": 75,
    "top": 30,
    "right": -18,
    "minWidth": 250,
    "paddingTop": 1,
    "paddingRight": 1,
    "paddingBottom": 1,
    "paddingLeft": 1,
    "transition": "opacity .3s ease-in-out",
    "opacity": 0,
    "color": "white",
    "borderRadius": 5,
    "background": "#4f3c28"
  },
  "Fatty-Field-help-bubble:before": {
    "position": "absolute",
    "top": -10,
    "right": 15,
    "content": "''",
    "borderWidth": "0 10px 10px 10px",
    "borderStyle": "solid",
    "borderColor": "transparent transparent #4f3c28 transparent"
  },
  "Fatty-Field-help-bubble--active": {
    "opacity": 0.8
  },
  "Fatty-Field-label:hover": {
    "color": "#44b9f0"
  },
  "Fatty-Field--focused Fatty-Field-Text-control": {
    "color": "#fff"
  },
  "Fatty-Field--focused Fatty-Field-background": {
    "transform": "scale(1, 1)"
  },
  "Fatty-Field--filled Fatty-Field-label": {
    "transform": "translate(0, -.3em)"
  },
  "Fatty-Field--focusedFatty-Field--filled Fatty-Field-label-text": {
    "animation": "Fatty-Field-filled-labelAnim .3s cubic-bezier(.68, -.55, .27, 1.55)"
  }
}
