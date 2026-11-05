"""Template-fill engine: clones slides of the reference deck and replaces their text/images."""
import copy
import re
from pptx import Presentation
from pptx.util import Emu, Inches
from pptx.oxml.ns import qn
from lxml import etree

R_NS = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

LAYOUT = {  # name -> 1-based slide index in the reference deck
    'cover': 1, 'index': 2, 'divider': 3, 'radial': 4, 'photo': 5, 'cards3': 6,
    'versus': 8, 'table': 9, 'objective': 10, 'grid4': 11, 'text': 12,
    'bignum': 13, 'steps': 14, 'transform': 15,
}


class Deck:
    def __init__(self, template, img_dir):
        self.prs = Presentation(template)
        self.src = list(self.prs.slides)
        self.n_src = len(self.src)
        self.img_dir = img_dir

    # ---------- structure ----------
    def clone(self, layout):
        src = self.src[LAYOUT[layout] - 1]
        new = self.prs.slides.add_slide(src.slide_layout)
        for shp in list(new.shapes):
            shp._element.getparent().remove(shp._element)
        rid_map = {}
        for rid, rel in src.part.rels.items():
            if rel.reltype.endswith('/notesSlide') or rel.reltype.endswith('/slideLayout'):
                continue
            if rel.is_external:
                rid_map[rid] = new.part.relate_to(rel.target_ref, rel.reltype, is_external=True)
            else:
                rid_map[rid] = new.part.relate_to(rel.target_part, rel.reltype)
        src_bg = src._element.cSld.bg
        if src_bg is not None:
            new._element.cSld.insert(0, copy.deepcopy(src_bg))
        tree = new.shapes._spTree
        for el in src.shapes._spTree.iterchildren():
            if el.tag in (qn('p:nvGrpSpPr'), qn('p:grpSpPr')):
                continue
            el2 = copy.deepcopy(el)
            for node in el2.iter():
                for k, v in list(node.attrib.items()):
                    if k.startswith('{%s}' % R_NS) and v in rid_map:
                        node.set(k, rid_map[v])
            tree.append(el2)
        return Slide(self, new)

    def finish(self, path):
        sldIdLst = self.prs.slides._sldIdLst
        for sldId in list(sldIdLst)[:self.n_src]:
            self.prs.part.drop_rel(sldId.get(qn('r:id')))
            sldIdLst.remove(sldId)
        self.prs.save(path)


def _runs_from_markup(text):
    """'**bold** normal' -> [(text, bold)]"""
    parts = re.split(r'(\*\*.+?\*\*)', text)
    out = []
    for p in parts:
        if not p:
            continue
        if p.startswith('**') and p.endswith('**'):
            out.append((p[2:-2], True))
        else:
            out.append((p, False))
    return out


def set_paras(txBody_owner, paras, size=None, color=None, accent='FC5230'):
    """Replace all paragraphs of a text frame, keeping the first paragraph/run formatting.
    paras: list of strings; '**x**' marks bold+accent runs; '' gives an empty line."""
    tf = txBody_owner.text_frame
    txBody = tf._txBody
    bp = txBody.find(qn('a:bodyPr'))
    if bp is not None:
        for af in bp.findall(qn('a:normAutofit')):
            bp.remove(af)
    ps = txBody.findall(qn('a:p'))
    tmpl_p = None
    for p in ps:  # first paragraph that has a run
        if p.find(qn('a:r')) is not None:
            tmpl_p = p
            break
    if tmpl_p is None:
        tmpl_p = ps[0]
    tmpl_r = tmpl_p.find(qn('a:r'))
    for p in ps:
        txBody.remove(p)
    if isinstance(paras, str):
        paras = [paras]
    for text in paras:
        p = etree.SubElement(txBody, qn('a:p'))
        ppr = tmpl_p.find(qn('a:pPr'))
        if ppr is not None:
            p.append(copy.deepcopy(ppr))
        for seg, bold in _runs_from_markup(text) or [('', False)]:
            r = copy.deepcopy(tmpl_r) if tmpl_r is not None else etree.SubElement(p, qn('a:r'))
            if tmpl_r is not None:
                p.append(r)
            rpr = r.find(qn('a:rPr'))
            if rpr is None:
                rpr = etree.Element(qn('a:rPr'))
                r.insert(0, rpr)
            if size:
                rpr.set('sz', str(int(size * 100)))
            if color:
                _set_color(rpr, color)
            if bold:
                rpr.set('b', '1')
                _set_color(rpr, accent)
                _set_font(rpr, 'Pretendard Bold')
            r.find(qn('a:t')).text = seg
        end = tmpl_p.find(qn('a:endParaRPr'))
        if end is not None:
            p.append(copy.deepcopy(end))


def _set_color(rpr, hexcol):
    for f in rpr.findall(qn('a:solidFill')):
        rpr.remove(f)
    sf = etree.Element(qn('a:solidFill'))
    c = etree.SubElement(sf, qn('a:srgbClr'))
    c.set('val', hexcol)
    # solidFill must come after ln and before latin/ea
    idx = 0
    for i, ch in enumerate(rpr):
        if ch.tag == qn('a:ln'):
            idx = i + 1
    rpr.insert(idx, sf)


def _set_font(rpr, face):
    for tag in ('a:latin', 'a:ea', 'a:cs'):
        el = rpr.find(qn(tag))
        if el is not None:
            el.set('typeface', face)


class Slide:
    def __init__(self, deck, slide):
        self.deck = deck
        self.s = slide

    def shape(self, name):
        for sh in self.s.shapes:
            if sh.name == name:
                return sh
        raise KeyError(name)

    def t(self, name, paras, **kw):
        set_paras(self.shape(name), paras, **kw)
        return self

    def remove(self, *names):
        for n in names:
            sh = self.shape(n)
            sh._element.getparent().remove(sh._element)
        return self

    def move(self, name, x=None, y=None, w=None, h=None):
        sh = self.shape(name)
        if x is not None: sh.left = Inches(x)
        if y is not None: sh.top = Inches(y)
        if w is not None: sh.width = Inches(w)
        if h is not None: sh.height = Inches(h)
        return self

    def image(self, name, key):
        """Replace picture `name` with generated image key, same position/size and z-order."""
        sh = self.shape(name)
        x, y, w, h = sh.left, sh.top, sh.width, sh.height
        el = sh._element
        pic = self.s.shapes.add_picture(f'{self.deck.img_dir}/{key}.png', x, y, w, h)
        el.addnext(pic._element)
        el.getparent().remove(el)
        pic.name = name
        return self

    def notes(self, text):
        self.s.notes_slide.notes_text_frame.text = text
        return self

    def header(self, text):
        """Pill text in the window bar (the 'presentation_xxx' label)."""
        for sh in self.s.shapes:
            if sh.has_text_frame and sh.text_frame.text.startswith('presentation'):
                set_paras(sh, [text])
                return self
        return self

    # ---------- tables ----------
    def table(self, name):
        return self.shape(name)


def fill_cell(cell, paras, keep_bullet=False, size=None, color=None):
    """Fill a table cell; when keep_bullet, the first run (colored ●) is preserved."""
    txBody = cell._tc.find(qn('a:txBody'))
    p0 = txBody.find(qn('a:p'))
    runs = p0.findall(qn('a:r'))
    if keep_bullet and len(runs) >= 2:
        bullet, tmpl_r = runs[0], runs[1]
    else:
        bullet, tmpl_r = None, runs[-1] if runs else None
    for p in txBody.findall(qn('a:p')):
        txBody.remove(p)
    if isinstance(paras, str):
        paras = [paras]
    for i, text in enumerate(paras):
        p = etree.SubElement(txBody, qn('a:p'))
        ppr = p0.find(qn('a:pPr'))
        if ppr is not None:
            p.append(copy.deepcopy(ppr))
        if bullet is not None and i == 0:
            p.append(copy.deepcopy(bullet))
        for j, (seg, bold) in enumerate(_runs_from_markup(text) or [('', False)]):
            if bullet is not None and i == 0 and j == 0:
                seg = ' ' + seg
            r = copy.deepcopy(tmpl_r)
            rpr = r.find(qn('a:rPr'))
            if size:
                rpr.set('sz', str(int(size * 100)))
            if color:
                _set_color(rpr, color)
            if bold:
                rpr.set('b', '1')
                _set_font(rpr, 'Pretendard Bold')
            r.find(qn('a:t')).text = seg
            p.append(r)


def bullet_color(cell, hexcol):
    r = cell._tc.find(qn('a:txBody')).find(qn('a:p')).find(qn('a:r'))
    _set_color(r.find(qn('a:rPr')), hexcol)


def resize_table(gf, n_rows, n_cols, width_in, col_widths=None, row_h=None):
    tbl = gf.table._tbl
    grid = tbl.find(qn('a:tblGrid'))
    cols = grid.findall(qn('a:gridCol'))
    # columns
    while len(cols) < n_cols:
        grid.append(copy.deepcopy(cols[-1]))
        for tr in tbl.findall(qn('a:tr')):
            tr.append(copy.deepcopy(tr.findall(qn('a:tc'))[-1]))
        cols = grid.findall(qn('a:gridCol'))
    while len(cols) > n_cols:
        grid.remove(cols[-1])
        for tr in tbl.findall(qn('a:tr')):
            tr.remove(tr.findall(qn('a:tc'))[-1])
        cols = grid.findall(qn('a:gridCol'))
    # rows
    trs = tbl.findall(qn('a:tr'))
    while len(trs) < n_rows:
        trs[-1].addnext(copy.deepcopy(trs[-1]))
        trs = tbl.findall(qn('a:tr'))
    while len(trs) > n_rows:
        tbl.remove(trs[-1])
        trs = tbl.findall(qn('a:tr'))
    total = Inches(width_in)
    if col_widths is None:
        col_widths = [1] * n_cols
    s = sum(col_widths)
    for c, wgt in zip(cols, col_widths):
        c.set('w', str(int(total * wgt / s)))
    gf.width = total
    if row_h:
        for tr in trs:
            tr.set('h', str(int(Inches(row_h))))
