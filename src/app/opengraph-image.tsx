import {
  ImageResponse,
} from "next/og";


export const alt =
  "Jorge Luis De los Santos León — Full Stack Software Engineer";


export const size = {
  width: 1200,
  height: 630,
};


export const contentType =
  "image/png";


export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position:
            "relative",

          display:
            "flex",

          flexDirection:
            "column",

          justifyContent:
            "space-between",

          width:
            "100%",

          height:
            "100%",

          overflow:
            "hidden",

          padding:
            "64px 72px",

          background:
            "#0B1020",

          color:
            "#F4F7FB",
        }}
      >
        <div
          style={{
            position:
              "absolute",

            top:
              "-220px",

            right:
              "-120px",

            width:
              "620px",

            height:
              "620px",

            borderRadius:
              "50%",

            background:
              "radial-gradient(circle, rgba(108, 99, 255, 0.34) 0%, rgba(108, 99, 255, 0) 68%)",
          }}
        />

        <div
          style={{
            position:
              "absolute",

            bottom:
              "-300px",

            left:
              "150px",

            width:
              "700px",

            height:
              "700px",

            borderRadius:
              "50%",

            background:
              "radial-gradient(circle, rgba(34, 211, 197, 0.22) 0%, rgba(34, 211, 197, 0) 68%)",
          }}
        />

        <div
          style={{
            position:
              "absolute",

            inset:
              "24px",

            border:
              "1px solid #27344D",

            borderRadius:
              "28px",
          }}
        />

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            fontSize:
              "22px",

            fontWeight:
              700,

            letterSpacing:
              "0.08em",
          }}
        >
          <span>
            JORGE
          </span>

          <span
            style={{
              color:
                "#22D3C5",
            }}
          >
            .
          </span>
        </div>

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            flexDirection:
              "column",

            maxWidth:
              "950px",
          }}
        >
          <div
            style={{
              display:
                "flex",

              fontSize:
                "70px",

              fontWeight:
                700,

              lineHeight:
                1.02,

              letterSpacing:
                "-0.04em",
            }}
          >
            Jorge Luis
          </div>

          <div
            style={{
              display:
                "flex",

              marginTop:
                "4px",

              fontSize:
                "70px",

              fontWeight:
                700,

              lineHeight:
                1.02,

              letterSpacing:
                "-0.04em",
            }}
          >
            De los Santos León
          </div>

          <div
            style={{
              display:
                "flex",

              marginTop:
                "30px",

              fontSize:
                "29px",

              fontWeight:
                500,

              color:
                "#A8B3C7",
            }}
          >
            Full Stack Software Engineer
          </div>
        </div>

        <div
          style={{
            position:
              "relative",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",
          }}
        >
          <div
            style={{
              display:
                "flex",

              gap:
                "10px",
            }}
          >
            {[
              "FastAPI",
              "React",
              "Next.js",
              "PostgreSQL",
            ].map(
              (
                technology,
              ) => (
                <div
                  key={
                    technology
                  }
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    padding:
                      "10px 16px",

                    border:
                      "1px solid #27344D",

                    borderRadius:
                      "999px",

                    background:
                      "#11182B",

                    color:
                      "#A8B3C7",

                    fontSize:
                      "17px",
                  }}
                >
                  {technology}
                </div>
              ),
            )}
          </div>

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "10px",

              color:
                "#A8B3C7",

              fontSize:
                "17px",
            }}
          >
            <div
              style={{
                width:
                  "8px",

                height:
                  "8px",

                borderRadius:
                  "50%",

                background:
                  "#22D3C5",
              }}
            />

            Cancún, Mexico
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}