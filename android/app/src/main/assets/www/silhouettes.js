const SILHOUETTES = [
 {
  "id": "unicorn",
  "name": "Unicornio",
  "category": "animals",
  "svg": "<rect x=\"108\" y=\"248\" width=\"22\" height=\"42\" rx=\"11\" class=\"rg\"/><rect x=\"142\" y=\"252\" width=\"22\" height=\"38\" rx=\"11\" class=\"rg\"/><rect x=\"182\" y=\"252\" width=\"22\" height=\"38\" rx=\"11\" class=\"rg\"/><rect x=\"216\" y=\"248\" width=\"22\" height=\"42\" rx=\"11\" class=\"rg\"/><path d=\"M232 196 C272 182 288 222 270 250 C258 270 234 266 232 248 C248 240 250 216 232 196 Z\" class=\"rg\"/><ellipse cx=\"162\" cy=\"216\" rx=\"72\" ry=\"54\" class=\"rg\"/><ellipse cx=\"106\" cy=\"82\" rx=\"16\" ry=\"28\" transform=\"rotate(-30 106 82)\" class=\"rg\"/><ellipse cx=\"214\" cy=\"82\" rx=\"16\" ry=\"28\" transform=\"rotate(30 214 82)\" class=\"rg\"/><path d=\"M148 58 L160 2 L176 56 Z\" class=\"rg\"/><circle cx=\"86\" cy=\"110\" r=\"26\" class=\"rg\"/><circle cx=\"234\" cy=\"110\" r=\"26\" class=\"rg\"/><circle cx=\"98\" cy=\"166\" r=\"24\" class=\"rg\"/><circle cx=\"222\" cy=\"166\" r=\"24\" class=\"rg\"/><circle cx=\"160\" cy=\"128\" r=\"66\" class=\"rg\"/><ellipse cx=\"160\" cy=\"168\" rx=\"26\" ry=\"18\" class=\"rg\"/><circle cx=\"134\" cy=\"122\" r=\"10\" class=\"rg\"/><circle cx=\"186\" cy=\"122\" r=\"10\" class=\"rg\"/><path d=\"M160 158 L170 170 L150 170 Z\" class=\"rg\"/>"
 },
 {
  "id": "babyUnicorn",
  "name": "Unicornito",
  "category": "animals",
  "svg": "<rect x=\"126\" y=\"250\" width=\"22\" height=\"36\" rx=\"11\" class=\"rg\"/><rect x=\"172\" y=\"250\" width=\"22\" height=\"36\" rx=\"11\" class=\"rg\"/><ellipse cx=\"160\" cy=\"214\" rx=\"58\" ry=\"48\" class=\"rg\"/><ellipse cx=\"108\" cy=\"88\" rx=\"16\" ry=\"27\" transform=\"rotate(-28 108 88)\" class=\"rg\"/><ellipse cx=\"212\" cy=\"88\" rx=\"16\" ry=\"27\" transform=\"rotate(28 212 88)\" class=\"rg\"/><path d=\"M148 64 L160 6 L176 62 Z\" class=\"rg\"/><path d=\"M196 76 C240 90 244 142 214 162 C228 130 220 96 196 76 Z\" class=\"rg\"/><circle cx=\"160\" cy=\"130\" r=\"62\" class=\"rg\"/><ellipse cx=\"160\" cy=\"166\" rx=\"23\" ry=\"15\" class=\"rg\"/><circle cx=\"137\" cy=\"126\" r=\"9\" class=\"rg\"/><circle cx=\"183\" cy=\"126\" r=\"9\" class=\"rg\"/><path d=\"M160 158 L169 168 L151 168 Z\" class=\"rg\"/>"
 },
 {
  "id": "flower",
  "name": "Flor",
  "category": "animals",
  "svg": "<rect x=\"152\" y=\"140\" width=\"15\" height=\"142\" rx=\"7\" class=\"rg\"/><path d=\"M152 214 C112 194 86 214 88 240 C118 250 146 238 152 214 Z\" class=\"rg\"/><path d=\"M167 188 C207 168 233 188 231 214 C201 224 173 212 167 188 Z\" class=\"rg\"/><circle cx=\"160\" cy=\"44\" r=\"33\" class=\"rg\"/><circle cx=\"212\" cy=\"74\" r=\"33\" class=\"rg\"/><circle cx=\"212\" cy=\"134\" r=\"33\" class=\"rg\"/><circle cx=\"160\" cy=\"164\" r=\"33\" class=\"rg\"/><circle cx=\"108\" cy=\"134\" r=\"33\" class=\"rg\"/><circle cx=\"108\" cy=\"74\" r=\"33\" class=\"rg\"/><circle cx=\"160\" cy=\"104\" r=\"29\" class=\"rg\"/>"
 },
 {
  "id": "sunflower",
  "name": "Girasol",
  "category": "animals",
  "svg": "<rect x=\"152\" y=\"150\" width=\"15\" height=\"132\" rx=\"7\" class=\"rg\"/><path d=\"M152 220 C112 200 86 220 88 246 C118 256 146 244 152 220 Z\" class=\"rg\"/><path d=\"M167 196 C207 176 233 196 231 222 C201 232 173 220 167 196 Z\" class=\"rg\"/><ellipse cx=\"160.0\" cy=\"48.0\" rx=\"15\" ry=\"38\" transform=\"rotate(0 160.0 48.0)\" class=\"rg\"/><ellipse cx=\"195.3\" cy=\"59.5\" rx=\"15\" ry=\"38\" transform=\"rotate(36 195.3 59.5)\" class=\"rg\"/><ellipse cx=\"217.1\" cy=\"89.5\" rx=\"15\" ry=\"38\" transform=\"rotate(72 217.1 89.5)\" class=\"rg\"/><ellipse cx=\"217.1\" cy=\"126.5\" rx=\"15\" ry=\"38\" transform=\"rotate(108 217.1 126.5)\" class=\"rg\"/><ellipse cx=\"195.3\" cy=\"156.5\" rx=\"15\" ry=\"38\" transform=\"rotate(144 195.3 156.5)\" class=\"rg\"/><ellipse cx=\"160.0\" cy=\"168.0\" rx=\"15\" ry=\"38\" transform=\"rotate(180 160.0 168.0)\" class=\"rg\"/><ellipse cx=\"124.7\" cy=\"156.5\" rx=\"15\" ry=\"38\" transform=\"rotate(216 124.7 156.5)\" class=\"rg\"/><ellipse cx=\"102.9\" cy=\"126.5\" rx=\"15\" ry=\"38\" transform=\"rotate(252 102.9 126.5)\" class=\"rg\"/><ellipse cx=\"102.9\" cy=\"89.5\" rx=\"15\" ry=\"38\" transform=\"rotate(288 102.9 89.5)\" class=\"rg\"/><ellipse cx=\"124.7\" cy=\"59.5\" rx=\"15\" ry=\"38\" transform=\"rotate(324 124.7 59.5)\" class=\"rg\"/><circle cx=\"160\" cy=\"108\" r=\"43\" class=\"rg\"/><circle cx=\"160\" cy=\"108\" r=\"24\" class=\"rg\"/>"
 },
 {
  "id": "snail",
  "name": "Caracol",
  "category": "animals",
  "svg": "<path d=\"M36 242 C30 206 66 190 104 196 L214 210 C244 216 244 242 214 242 Z\" class=\"rg\"/><circle cx=\"182\" cy=\"150\" r=\"74\" class=\"rg\"/><circle cx=\"182\" cy=\"150\" r=\"47\" class=\"rg\"/><circle cx=\"182\" cy=\"150\" r=\"21\" class=\"rg\"/><path d=\"M64 200 C56 172 44 160 34 156\" class=\"rg ln\" fill=\"none\"/><path d=\"M94 196 C92 168 84 154 74 146\" class=\"rg ln\" fill=\"none\"/><circle cx=\"32\" cy=\"152\" r=\"9\" class=\"rg\"/><circle cx=\"72\" cy=\"142\" r=\"9\" class=\"rg\"/>"
 },
 {
  "id": "babySnail",
  "name": "Caracolito",
  "category": "animals",
  "svg": "<path d=\"M44 250 C38 220 70 204 104 210 L212 222 C240 228 240 250 212 250 Z\" class=\"rg\"/><circle cx=\"176\" cy=\"160\" r=\"68\" class=\"rg\"/><circle cx=\"176\" cy=\"160\" r=\"50\" class=\"rg\"/><circle cx=\"176\" cy=\"160\" r=\"34\" class=\"rg\"/><circle cx=\"176\" cy=\"160\" r=\"16\" class=\"rg\"/><path d=\"M70 212 C62 184 52 172 42 168\" class=\"rg ln\" fill=\"none\"/><path d=\"M98 208 C96 182 88 168 78 160\" class=\"rg ln\" fill=\"none\"/><circle cx=\"40\" cy=\"164\" r=\"9\" class=\"rg\"/><circle cx=\"76\" cy=\"156\" r=\"9\" class=\"rg\"/>"
 },
 {
  "id": "cat",
  "name": "Gato",
  "category": "animals",
  "svg": "<ellipse cx=\"160\" cy=\"220\" rx=\"72\" ry=\"56\" class=\"rg\"/><ellipse cx=\"160\" cy=\"232\" rx=\"44\" ry=\"38\" class=\"rg\"/><path d=\"M108 78 L104 24 L152 60 Z\" class=\"rg\"/><path d=\"M212 78 L216 24 L168 60 Z\" class=\"rg\"/><path d=\"M226 240 C266 232 270 194 248 182\" class=\"rg ln\" fill=\"none\"/><circle cx=\"160\" cy=\"118\" r=\"62\" class=\"rg\"/><circle cx=\"136\" cy=\"108\" r=\"11\" class=\"rg\"/><circle cx=\"184\" cy=\"108\" r=\"11\" class=\"rg\"/><path d=\"M160 130 L174 142 L146 142 Z\" class=\"rg\"/>"
 },
 {
  "id": "dog",
  "name": "Perro",
  "category": "animals",
  "svg": "<ellipse cx=\"160\" cy=\"215\" rx=\"78\" ry=\"58\" class=\"rg\"/><ellipse cx=\"160\" cy=\"228\" rx=\"47\" ry=\"40\" class=\"rg\"/><path d=\"M106 78 C74 74 70 140 100 146 C110 122 106 96 106 78 Z\" class=\"rg\"/><path d=\"M214 78 C246 74 250 140 220 146 C210 122 214 96 214 78 Z\" class=\"rg\"/><circle cx=\"160\" cy=\"115\" r=\"60\" class=\"rg\"/><ellipse cx=\"160\" cy=\"146\" rx=\"30\" ry=\"22\" class=\"rg\"/><ellipse cx=\"160\" cy=\"134\" rx=\"11\" ry=\"8\" class=\"rg\"/><circle cx=\"138\" cy=\"100\" r=\"9\" class=\"rg\"/><circle cx=\"182\" cy=\"100\" r=\"9\" class=\"rg\"/>"
 },
 {
  "id": "rabbit",
  "name": "Conejo",
  "category": "animals",
  "svg": "<ellipse cx=\"160\" cy=\"232\" rx=\"62\" ry=\"48\" class=\"rg\"/><ellipse cx=\"160\" cy=\"242\" rx=\"38\" ry=\"32\" class=\"rg\"/><ellipse cx=\"138\" cy=\"60\" rx=\"18\" ry=\"52\" transform=\"rotate(-12 138 60)\" class=\"rg\"/><ellipse cx=\"182\" cy=\"60\" rx=\"18\" ry=\"52\" transform=\"rotate(12 182 60)\" class=\"rg\"/><circle cx=\"160\" cy=\"140\" r=\"52\" class=\"rg\"/><circle cx=\"142\" cy=\"132\" r=\"8\" class=\"rg\"/><circle cx=\"178\" cy=\"132\" r=\"8\" class=\"rg\"/><path d=\"M160 152 L169 161 L151 161 Z\" class=\"rg\"/>"
 },
 {
  "id": "bear",
  "name": "Oso",
  "category": "animals",
  "svg": "<circle cx=\"104\" cy=\"76\" r=\"32\" class=\"rg\"/><circle cx=\"216\" cy=\"76\" r=\"32\" class=\"rg\"/><circle cx=\"160\" cy=\"150\" r=\"86\" class=\"rg\"/><ellipse cx=\"160\" cy=\"182\" rx=\"44\" ry=\"34\" class=\"rg\"/><ellipse cx=\"160\" cy=\"164\" rx=\"15\" ry=\"11\" class=\"rg\"/><circle cx=\"128\" cy=\"126\" r=\"10\" class=\"rg\"/><circle cx=\"192\" cy=\"126\" r=\"10\" class=\"rg\"/>"
 },
 {
  "id": "elephant",
  "name": "Elefante",
  "category": "animals",
  "svg": "<rect x=\"132\" y=\"212\" width=\"32\" height=\"60\" rx=\"10\" class=\"rg\"/><rect x=\"198\" y=\"212\" width=\"32\" height=\"60\" rx=\"10\" class=\"rg\"/><ellipse cx=\"184\" cy=\"166\" rx=\"76\" ry=\"62\" class=\"rg\"/><ellipse cx=\"188\" cy=\"182\" rx=\"44\" ry=\"38\" class=\"rg\"/><path d=\"M258 172 C286 166 292 200 274 210\" class=\"rg ln\" fill=\"none\"/><circle cx=\"106\" cy=\"150\" r=\"50\" class=\"rg\"/><path d=\"M68 168 C44 196 50 240 80 246 C98 250 102 230 90 226 C78 222 74 198 92 182 Z\" class=\"rg\"/><ellipse cx=\"128\" cy=\"140\" rx=\"30\" ry=\"38\" class=\"rg\"/><circle cx=\"80\" cy=\"138\" r=\"8\" class=\"rg\"/>"
 },
 {
  "id": "sheep",
  "name": "Oveja",
  "category": "animals",
  "svg": "<rect x=\"118\" y=\"228\" width=\"17\" height=\"46\" rx=\"8\" class=\"rg\"/><rect x=\"182\" y=\"228\" width=\"17\" height=\"46\" rx=\"8\" class=\"rg\"/><path d=\"M92 204 C58 204 58 148 92 142 C92 106 146 98 154 114 C162 98 216 106 216 142 C250 148 250 204 216 204 C216 232 162 242 154 228 C146 242 92 232 92 204 Z\" class=\"rg\"/><ellipse cx=\"154\" cy=\"180\" rx=\"36\" ry=\"30\" class=\"rg\"/><ellipse cx=\"248\" cy=\"184\" rx=\"29\" ry=\"33\" class=\"rg\"/><ellipse cx=\"220\" cy=\"166\" rx=\"19\" ry=\"10\" transform=\"rotate(-20 220 166)\" class=\"rg\"/><circle cx=\"252\" cy=\"176\" r=\"7\" class=\"rg\"/>"
 },
 {
  "id": "owl",
  "name": "Búho",
  "category": "animals",
  "svg": "<ellipse cx=\"132\" cy=\"272\" rx=\"18\" ry=\"8\" class=\"rg\"/><ellipse cx=\"188\" cy=\"272\" rx=\"18\" ry=\"8\" class=\"rg\"/><path d=\"M160 56 C226 56 262 118 258 178 C254 240 214 268 160 268 C106 268 66 240 62 178 C58 118 94 56 160 56 Z\" class=\"rg\"/><ellipse cx=\"160\" cy=\"206\" rx=\"52\" ry=\"48\" class=\"rg\"/><path d=\"M70 160 C56 200 62 236 84 250 C92 216 88 184 70 160 Z\" class=\"rg\"/><path d=\"M250 160 C264 200 258 236 236 250 C228 216 232 184 250 160 Z\" class=\"rg\"/><circle cx=\"124\" cy=\"140\" r=\"36\" class=\"rg\"/><circle cx=\"196\" cy=\"140\" r=\"36\" class=\"rg\"/><circle cx=\"124\" cy=\"140\" r=\"14\" class=\"rg\"/><circle cx=\"196\" cy=\"140\" r=\"14\" class=\"rg\"/><path d=\"M160 164 L176 188 L144 188 Z\" class=\"rg\"/>"
 },
 {
  "id": "bird",
  "name": "Pájaro",
  "category": "animals",
  "svg": "<rect x=\"140\" y=\"210\" width=\"9\" height=\"46\" rx=\"4\" class=\"rg\"/><rect x=\"174\" y=\"210\" width=\"9\" height=\"46\" rx=\"4\" class=\"rg\"/><path d=\"M94 148 C62 120 34 116 20 126 C34 146 34 170 22 192 C38 200 68 184 94 172 Z\" class=\"rg\"/><ellipse cx=\"152\" cy=\"158\" rx=\"70\" ry=\"58\" class=\"rg\"/><ellipse cx=\"148\" cy=\"170\" rx=\"40\" ry=\"33\" class=\"rg\"/><circle cx=\"214\" cy=\"114\" r=\"40\" class=\"rg\"/><path d=\"M250 108 L300 122 L250 136 Z\" class=\"rg\"/><ellipse cx=\"148\" cy=\"166\" rx=\"40\" ry=\"25\" transform=\"rotate(-18 148 166)\" class=\"rg\"/><circle cx=\"222\" cy=\"106\" r=\"7\" class=\"rg\"/>"
 },
 {
  "id": "butterfly",
  "name": "Mariposa",
  "category": "animals",
  "svg": "<path d=\"M146 110 C90 40 20 70 44 130 C62 176 116 168 146 146 Z\" class=\"rg\"/><path d=\"M174 110 C230 40 300 70 276 130 C258 176 204 168 174 146 Z\" class=\"rg\"/><path d=\"M146 160 C96 190 50 240 96 264 C134 282 142 220 146 190 Z\" class=\"rg\"/><path d=\"M174 160 C224 190 270 240 224 264 C186 282 178 220 174 190 Z\" class=\"rg\"/><ellipse cx=\"160\" cy=\"150\" rx=\"14\" ry=\"76\" class=\"rg\"/><path d=\"M154 78 C140 46 116 36 100 40\" class=\"rg ln\" fill=\"none\"/><path d=\"M166 78 C180 46 204 36 220 40\" class=\"rg ln\" fill=\"none\"/>"
 },
 {
  "id": "fish",
  "name": "Pez",
  "category": "animals",
  "svg": "<path d=\"M250 150 L306 96 L306 204 Z\" class=\"rg\"/><ellipse cx=\"150\" cy=\"150\" rx=\"100\" ry=\"66\" class=\"rg\"/><path d=\"M140 84 C160 40 200 44 208 92 Z\" class=\"rg\"/><path d=\"M140 216 C160 260 200 256 208 208 Z\" class=\"rg\"/><circle cx=\"96\" cy=\"128\" r=\"13\" class=\"rg\"/><path d=\"M170 110 C200 130 200 170 170 190\" class=\"rg ln\" fill=\"none\"/>"
 },
 {
  "id": "house",
  "name": "Casa",
  "category": "places",
  "svg": "<rect x=\"0\" y=\"0\" width=\"320\" height=\"206\" rx=\"0\" class=\"rg\"/><circle cx=\"266\" cy=\"46\" r=\"30\" class=\"rg\"/><circle cx=\"58\" cy=\"54\" r=\"22\" class=\"rg\"/><circle cx=\"84\" cy=\"46\" r=\"27\" class=\"rg\"/><circle cx=\"110\" cy=\"56\" r=\"20\" class=\"rg\"/><rect x=\"0\" y=\"206\" width=\"320\" height=\"94\" rx=\"0\" class=\"rg\"/><rect x=\"34\" y=\"168\" width=\"18\" height=\"54\" rx=\"4\" class=\"rg\"/><circle cx=\"43\" cy=\"146\" r=\"36\" class=\"rg\"/><rect x=\"92\" y=\"132\" width=\"136\" height=\"88\" rx=\"4\" class=\"rg\"/><path d=\"M76 138 L160 68 L244 138 Z\" class=\"rg\"/><rect x=\"106\" y=\"148\" width=\"32\" height=\"28\" rx=\"4\" class=\"rg\"/><rect x=\"190\" y=\"148\" width=\"32\" height=\"28\" rx=\"4\" class=\"rg\"/><rect x=\"142\" y=\"166\" width=\"36\" height=\"54\" rx=\"6\" class=\"rg\"/><path d=\"M136 300 L184 300 L173 220 L147 220 Z\" class=\"rg\"/><path d=\"M302.0 46.0 L314.0 46.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M291.5 71.5 L299.9 79.9\" class=\"rg ln\" fill=\"none\"/><path d=\"M266.0 82.0 L266.0 94.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M240.5 71.5 L232.1 79.9\" class=\"rg ln\" fill=\"none\"/><path d=\"M230.0 46.0 L218.0 46.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M240.5 20.5 L232.1 12.1\" class=\"rg ln\" fill=\"none\"/><path d=\"M266.0 10.0 L266.0 -2.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M291.5 20.5 L299.9 12.1\" class=\"rg ln\" fill=\"none\"/><circle cx=\"255.8\" cy=\"41.2\" r=\"3.9\" class=\"rg\"/><circle cx=\"276.2\" cy=\"41.2\" r=\"3.9\" class=\"rg\"/><path d=\"M255.8 53.8 C261.8 64.6 270.2 64.6 276.2 53.8\" class=\"rg ln\" fill=\"none\"/>"
 },
 {
  "id": "beach",
  "name": "Playa",
  "category": "places",
  "svg": "<rect x=\"0\" y=\"0\" width=\"320\" height=\"148\" rx=\"0\" class=\"rg\"/><circle cx=\"56\" cy=\"48\" r=\"28\" class=\"rg\"/><rect x=\"0\" y=\"148\" width=\"320\" height=\"76\" rx=\"0\" class=\"rg\"/><path d=\"M22 176 C42 166 62 186 82 176\" class=\"rg ln\" fill=\"none\"/><path d=\"M124 196 C144 186 164 206 184 196\" class=\"rg ln\" fill=\"none\"/><rect x=\"0\" y=\"224\" width=\"320\" height=\"76\" rx=\"0\" class=\"rg\"/><path d=\"M254 226 C248 192 252 160 262 138 L276 142 C266 162 264 194 268 226 Z\" class=\"rg\"/><path d=\"M266 144 C238 126 206 128 190 144 C214 152 244 154 266 152 Z\" class=\"rg\"/><path d=\"M266 140 C254 112 232 94 210 90 C216 114 240 130 262 146 Z\" class=\"rg\"/><path d=\"M272 140 C286 112 308 96 318 94 C314 118 294 132 276 146 Z\" class=\"rg\"/><path d=\"M274 144 C296 130 314 134 320 148 C304 154 288 154 274 152 Z\" class=\"rg\"/><circle cx=\"260\" cy=\"154\" r=\"7\" class=\"rg\"/><circle cx=\"278\" cy=\"156\" r=\"7\" class=\"rg\"/><path d=\"M56 216 L146 216 L132 242 L70 242 Z\" class=\"rg\"/><path d=\"M100 212 L100 146 L148 212 Z\" class=\"rg\"/><circle cx=\"182\" cy=\"262\" r=\"15\" class=\"rg\"/><path d=\"M90.0 48.0 L102.0 48.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M80.0 72.0 L88.5 80.5\" class=\"rg ln\" fill=\"none\"/><path d=\"M56.0 82.0 L56.0 94.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M32.0 72.0 L23.5 80.5\" class=\"rg ln\" fill=\"none\"/><path d=\"M22.0 48.0 L10.0 48.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M32.0 24.0 L23.5 15.5\" class=\"rg ln\" fill=\"none\"/><path d=\"M56.0 14.0 L56.0 2.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M80.0 24.0 L88.5 15.5\" class=\"rg ln\" fill=\"none\"/><circle cx=\"46.48\" cy=\"43.519999999999996\" r=\"3.6\" class=\"rg\"/><circle cx=\"65.52\" cy=\"43.519999999999996\" r=\"3.6\" class=\"rg\"/><path d=\"M46.48 55.28 C52.08 65.36 59.92 65.36 65.52 55.28\" class=\"rg ln\" fill=\"none\"/>"
 },
 {
  "id": "mountains",
  "name": "Montañas",
  "category": "places",
  "svg": "<rect x=\"0\" y=\"0\" width=\"320\" height=\"198\" rx=\"0\" class=\"rg\"/><circle cx=\"270\" cy=\"50\" r=\"26\" class=\"rg\"/><path d=\"M0 198 L86 74 L172 198 Z\" class=\"rg\"/><path d=\"M86 74 L112 112 L96 106 L76 118 L62 100 Z\" class=\"rg\"/><path d=\"M132 198 L220 88 L308 198 Z\" class=\"rg\"/><path d=\"M220 88 L244 122 L228 116 L210 128 L198 112 Z\" class=\"rg\"/><rect x=\"0\" y=\"198\" width=\"320\" height=\"102\" rx=\"0\" class=\"rg\"/><ellipse cx=\"160\" cy=\"254\" rx=\"112\" ry=\"32\" class=\"rg\"/><rect x=\"40\" y=\"216\" width=\"12\" height=\"24\" rx=\"3\" class=\"rg\"/><path d=\"M22 218 L46 168 L70 218 Z\" class=\"rg\"/><rect x=\"272\" y=\"220\" width=\"12\" height=\"24\" rx=\"3\" class=\"rg\"/><path d=\"M256 222 L278 180 L300 222 Z\" class=\"rg\"/><path d=\"M302.0 50.0 L314.0 50.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M292.6 72.6 L301.1 81.1\" class=\"rg ln\" fill=\"none\"/><path d=\"M270.0 82.0 L270.0 94.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M247.4 72.6 L238.9 81.1\" class=\"rg ln\" fill=\"none\"/><path d=\"M238.0 50.0 L226.0 50.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M247.4 27.4 L238.9 18.9\" class=\"rg ln\" fill=\"none\"/><path d=\"M270.0 18.0 L270.0 6.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M292.6 27.4 L301.1 18.9\" class=\"rg ln\" fill=\"none\"/><circle cx=\"261.16\" cy=\"45.84\" r=\"3.4\" class=\"rg\"/><circle cx=\"278.84\" cy=\"45.84\" r=\"3.4\" class=\"rg\"/><path d=\"M261.16 56.76 C266.36 66.12 273.64 66.12 278.84 56.76\" class=\"rg ln\" fill=\"none\"/>"
 },
 {
  "id": "castle",
  "name": "Castillo",
  "category": "places",
  "svg": "<rect x=\"0\" y=\"0\" width=\"320\" height=\"214\" rx=\"0\" class=\"rg\"/><circle cx=\"40\" cy=\"44\" r=\"20\" class=\"rg\"/><circle cx=\"66\" cy=\"38\" r=\"24\" class=\"rg\"/><circle cx=\"92\" cy=\"46\" r=\"18\" class=\"rg\"/><rect x=\"0\" y=\"214\" width=\"320\" height=\"86\" rx=\"0\" class=\"rg\"/><rect x=\"44\" y=\"112\" width=\"58\" height=\"108\" rx=\"0\" class=\"rg\"/><rect x=\"218\" y=\"112\" width=\"58\" height=\"108\" rx=\"0\" class=\"rg\"/><rect x=\"96\" y=\"142\" width=\"128\" height=\"78\" rx=\"0\" class=\"rg\"/><path d=\"M96 142 L96 128 L110 128 L110 142 L134 142 L134 128 L148 128 L148 142 L172 142 L172 128 L186 128 L186 142 L210 142 L210 128 L224 128 L224 142 Z\" class=\"rg\"/><path d=\"M36 112 L73 56 L110 112 Z\" class=\"rg\"/><path d=\"M210 112 L247 56 L284 112 Z\" class=\"rg\"/><path d=\"M73 56 L73 26\" class=\"rg ln\" fill=\"none\"/><path d=\"M73 28 L102 37 L73 46 Z\" class=\"rg\"/><path d=\"M247 56 L247 26\" class=\"rg ln\" fill=\"none\"/><path d=\"M247 28 L276 37 L247 46 Z\" class=\"rg\"/><rect x=\"60\" y=\"146\" width=\"26\" height=\"34\" rx=\"13\" class=\"rg\"/><rect x=\"234\" y=\"146\" width=\"26\" height=\"34\" rx=\"13\" class=\"rg\"/><path d=\"M134 220 L134 178 C134 156 186 156 186 178 L186 220 Z\" class=\"rg\"/>"
 },
 {
  "id": "rocket",
  "name": "Cohete",
  "category": "places",
  "svg": "<rect x=\"0\" y=\"0\" width=\"320\" height=\"300\" rx=\"0\" class=\"rg\"/><circle cx=\"44\" cy=\"226\" r=\"5\" class=\"rg\"/><circle cx=\"86\" cy=\"62\" r=\"4\" class=\"rg\"/><circle cx=\"250\" cy=\"214\" r=\"5\" class=\"rg\"/><circle cx=\"288\" cy=\"122\" r=\"4\" class=\"rg\"/><circle cx=\"30\" cy=\"148\" r=\"4\" class=\"rg\"/><circle cx=\"226\" cy=\"40\" r=\"5\" class=\"rg\"/><ellipse cx=\"66\" cy=\"66\" rx=\"58\" ry=\"17\" transform=\"rotate(-22 66 66)\" class=\"rg\"/><circle cx=\"66\" cy=\"66\" r=\"34\" class=\"rg\"/><path d=\"M104 216 L134 158 L134 208 Z\" class=\"rg\"/><path d=\"M216 216 L186 158 L186 208 Z\" class=\"rg\"/><path d=\"M160 44 C188 84 194 148 188 202 L132 202 C126 148 132 84 160 44 Z\" class=\"rg\"/><circle cx=\"160\" cy=\"118\" r=\"21\" class=\"rg\"/><rect x=\"132\" y=\"202\" width=\"56\" height=\"16\" rx=\"4\" class=\"rg\"/><path d=\"M136 218 C144 262 176 262 184 218 C172 240 148 240 136 218 Z\" class=\"rg\"/><path d=\"M150 218 C154 244 166 244 170 218 Z\" class=\"rg\"/>"
 },
 {
  "id": "rainbow",
  "name": "Arcoíris",
  "category": "places",
  "svg": "<rect x=\"0\" y=\"0\" width=\"320\" height=\"250\" rx=\"0\" class=\"rg\"/><circle cx=\"52\" cy=\"56\" r=\"26\" class=\"rg\"/><path d=\"M30 250 C30 178.2 88.2 120 160 120 C231.8 120 290 178.2 290 250 L270 250 C270 189.2 220.8 140 160 140 C99.2 140 50 189.2 50 250 Z\" class=\"rg\"/><path d=\"M50 250 C50 189.2 99.2 140 160 140 C220.8 140 270 189.2 270 250 L250 250 C250 200.3 209.7 160 160 160 C110.3 160 70 200.3 70 250 Z\" class=\"rg\"/><path d=\"M70 250 C70 200.3 110.3 160 160 160 C209.7 160 250 200.3 250 250 L230 250 C230 211.3 198.7 180 160 180 C121.3 180 90 211.3 90 250 Z\" class=\"rg\"/><path d=\"M90 250 C90 211.3 121.3 180 160 180 C198.7 180 230 211.3 230 250 L210 250 C210 222.4 187.6 200 160 200 C132.4 200 110 222.4 110 250 Z\" class=\"rg\"/><path d=\"M110 250 C110 222.4 132.4 200 160 200 C187.6 200 210 222.4 210 250 L190 250 C190 233.4 176.6 220 160 220 C143.4 220 130 233.4 130 250 Z\" class=\"rg\"/><rect x=\"0\" y=\"250\" width=\"320\" height=\"50\" rx=\"0\" class=\"rg\"/><path d=\"M0 250 C36 218 88 222 122 250 Z\" class=\"rg\"/><path d=\"M198 250 C232 220 284 218 320 250 Z\" class=\"rg\"/><circle cx=\"34\" cy=\"244\" r=\"20\" class=\"rg\"/><circle cx=\"60\" cy=\"236\" r=\"25\" class=\"rg\"/><circle cx=\"260\" cy=\"236\" r=\"25\" class=\"rg\"/><circle cx=\"286\" cy=\"244\" r=\"20\" class=\"rg\"/><path d=\"M84.0 56.0 L96.0 56.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M74.6 78.6 L83.1 87.1\" class=\"rg ln\" fill=\"none\"/><path d=\"M52.0 88.0 L52.0 100.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M29.4 78.6 L20.9 87.1\" class=\"rg ln\" fill=\"none\"/><path d=\"M20.0 56.0 L8.0 56.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M29.4 33.4 L20.9 24.9\" class=\"rg ln\" fill=\"none\"/><path d=\"M52.0 24.0 L52.0 12.0\" class=\"rg ln\" fill=\"none\"/><path d=\"M74.6 33.4 L83.1 24.9\" class=\"rg ln\" fill=\"none\"/><circle cx=\"43.16\" cy=\"51.84\" r=\"3.4\" class=\"rg\"/><circle cx=\"60.84\" cy=\"51.84\" r=\"3.4\" class=\"rg\"/><path d=\"M43.16 62.76 C48.36 72.12 55.64 72.12 60.84 62.76\" class=\"rg ln\" fill=\"none\"/>"
 }
];
