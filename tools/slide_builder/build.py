import os
import sys
import importlib
from engine import Deck

HERE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(HERE, 'template.pptx')
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
for name in sys.argv[1:]:
    m = importlib.import_module(name)
    d = Deck(REF, os.path.join(HERE, 'img'))
    m.build(d)
    d.finish(os.path.join(HERE, 'out', f'{name}.pptx'))
    print('built', name)
