import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// 🔥 Type cast to bypass broken typings
(pdfMake as any).vfs = (pdfFonts as any).pdfMake.vfs;

export default pdfMake;
