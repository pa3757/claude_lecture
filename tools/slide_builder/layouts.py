"""One function per reference layout. Each takes a Deck and plain content."""
from engine import fill_cell, resize_table, bullet_color
from pptx.util import Inches

PAL = ['FC5230', 'FFCD4A', '6FB848', '494A4E']


def _fin(sl, header, notes):
    if header:
        sl.header(header)
    if notes:
        sl.notes(notes)
    return sl


def cover(d, sub, title, header=None, notes=None):
    sl = d.clone('cover').t('TextBox 15', sub).t('TextBox 16', title)
    return _fin(sl, header, notes)


def index(d, rows, big='목차', small='INDEX', header=None, notes=None):
    sl = d.clone('index').t('TextBox 21', small).t('TextBox 22', big)
    names = [(11, 12), (13, 14), (15, 16), (17, 18), (19, 20)]
    for (a, b), (k, v) in zip(names, rows):
        sl.t(f'TextBox {a}', k).t(f'TextBox {b}', v)
    for (a, b) in names[len(rows):]:
        sl.remove(f'TextBox {a}', f'TextBox {b}')
    return _fin(sl, header, notes)


def divider(d, num, title_lines, desc_lines, header=None, notes=None):
    sl = d.clone('divider').t('TextBox 16', num).t('TextBox 17', title_lines).t('TextBox 18', desc_lines)
    return _fin(sl, header, notes)


def radial(d, title, center, items, header=None, notes=None, dsize=None):
    """items: 4 x (keyword, [desc lines]) — order: left-bottom, left-top, right-top, right-bottom."""
    sl = d.clone('radial').t('TextBox 30', title).t('TextBox 29', center)
    for (k, v), (kn, vn) in zip(items, [(22, 24), (26, 28), (25, 27), (21, 23)]):
        sl.t(f'TextBox {kn}', k).t(f'TextBox {vn}', v, size=dsize)
    return _fin(sl, header, notes)


def photo(d, title, key, body, img, header=None, notes=None, size=None):
    sl = d.clone('photo').t('TextBox 12', title).t('TextBox 13', key).t('TextBox 14', body, size=size)
    sl.image('Picture 8', img)
    return _fin(sl, header, notes)


def cards3(d, title, cards, sum_title, sum_body, header=None, notes=None, bsize=None):
    """cards: 3 x (title, body, sub)."""
    sl = d.clone('cards3').t('TextBox 15', title)
    for (ti, bo, su), (a, b, c) in zip(cards, [(17, 21, 19), (16, 20, 18), (22, 24, 23)]):
        sl.t(f'TextBox {a}', ti).t(f'TextBox {b}', bo, size=bsize).t(f'TextBox {c}', su, size=bsize)
    sl.t('TextBox 25', sum_title).t('TextBox 26', sum_body)
    return _fin(sl, header, notes)


def versus(d, title, a_title, b_title, a_rows, b_rows, pills=('compare_A', 'compare_B'), notes=None, size=None):
    sl = d.clone('versus').t('TextBox 17', title).t('TextBox 19', a_title).t('TextBox 18', b_title)
    sl.t('TextBox 15', pills[0]).t('TextBox 16', pills[1])
    for tname, rows in (('Table 21', a_rows), ('Table 20', b_rows)):
        gf = sl.shape(tname)
        resize_table(gf, len(rows), 1, 7.76)
        for i, r in enumerate(rows):
            fill_cell(gf.table.cell(i, 0), r if isinstance(r, list) else [r], size=size)
    return _fin(sl, None, notes)


def table(d, title, head, rows, points, header=None, notes=None, col_widths=None, size=None, row_h=None, bullets=True):
    """head: list of column headers; rows: list of lists; points: 3 x (label, big, desc)."""
    sl = d.clone('table').t('TextBox 16', title)
    sl.remove('Picture 12', 'Picture 14')
    gf = sl.shape('Table 13')
    resize_table(gf, len(rows) + 1, len(head), 17.98, col_widths=col_widths, row_h=row_h)
    t = gf.table
    import copy as _c
    from pptx.oxml.ns import qn as _q
    b_run = t.cell(1, 0)._tc.find(_q('a:txBody')).find(_q('a:p')).findall(_q('a:r'))[0]
    for r in range(1, len(rows) + 1):
        p0 = t.cell(r, 0)._tc.find(_q('a:txBody')).find(_q('a:p'))
        rs = p0.findall(_q('a:r'))
        if len(rs) < 2:
            rs[0].addprevious(_c.deepcopy(b_run))
    for c, h in enumerate(head):
        fill_cell(t.cell(0, c), h)
    for r, row in enumerate(rows, start=1):
        for c, val in enumerate(row):
            if c == 0:
                fill_cell(t.cell(r, c), val, keep_bullet=bullets, size=size)
                if bullets:
                    bullet_color(t.cell(r, c), PAL[(r - 1) % 4])
            else:
                fill_cell(t.cell(r, c), val, size=size)
    for (lab, big, desc), (a, b, c) in zip(points, [(18, 22, 20), (17, 21, 19), (23, 25, 24)]):
        sl.t(f'TextBox {a}', lab).t(f'TextBox {b}', big).t(f'TextBox {c}', desc)
    return _fin(sl, header, notes)


def objective(d, title, goal, left, box1, box2, label='목표', header=None, notes=None, size=None):
    """box: (title, [bullets])"""
    sl = d.clone('objective').t('TextBox 3', title).t('TextBox 16', label).t('TextBox 17', goal)
    sl.t('TextBox 18', left, size=size)
    sl.t('TextBox 19', box1[0]).t('TextBox 20', box1[1], size=size)
    sl.t('TextBox 21', box2[0]).t('TextBox 22', box2[1], size=size)
    return _fin(sl, header, notes)


def grid4(d, title, items, header=None, notes=None, size=None):
    """items: 4 x (title, [desc lines], image_key) — order: TL, TR, BL, BR."""
    sl = d.clone('grid4').t('TextBox 18', title)
    for (ti, de, img), (a, b, pic) in zip(items, [(22, 26, 'Picture 16'), (20, 24, 'Picture 14'), (21, 25, 'Picture 15'), (19, 23, 'Picture 13')]):
        sl.t(f'TextBox {a}', ti).t(f'TextBox {b}', de, size=size)
        sl.image(pic, img)
    return _fin(sl, header, notes)


def text(d, title, sub, body, header=None, notes=None, size=24):
    sl = d.clone('text').t('TextBox 13', title).t('TextBox 11', sub).t('TextBox 12', body, size=size)
    return _fin(sl, header, notes)


def bignum(d, title, items, header=None, notes=None, nsize=None, dsize=None):
    """items: 4 x (big, keyword, [desc lines])"""
    sl = d.clone('bignum').t('TextBox 26', title)
    for (big, kw, de), (a, b, c) in zip(items, [(29, 31, 33), (28, 30, 32), (27, 35, 36), (34, 37, 38)]):
        sl.t(f'TextBox {a}', big, size=nsize).t(f'TextBox {b}', kw).t(f'TextBox {c}', de, size=dsize)
    return _fin(sl, header, notes)


def steps(d, title, items, header=None, notes=None, size=None):
    """items: 4 x (step title, [desc lines])"""
    sl = d.clone('steps').t('TextBox 34', title)
    for (ti, de), (a, b) in zip(items, [(27, 28), (29, 26), (30, 31), (32, 33)]):
        sl.t(f'TextBox {a}', ti).t(f'TextBox {b}', de, size=size)
        sl.move(f'TextBox {b}', h=2.4)
    return _fin(sl, header, notes)


def transform(d, title, before, after, img_before, img_after, header=None, notes=None, size=None):
    """before/after: [desc lines]"""
    sl = d.clone('transform').t('TextBox 16', title).t('TextBox 20', before, size=size).t('TextBox 19', after, size=size)
    sl.image('Picture 10', img_before).image('Picture 9', img_after)
    return _fin(sl, header, notes)
