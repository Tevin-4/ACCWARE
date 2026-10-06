from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

prs = Presentation()
prs.slide_width = Inches(13.333)
prs.slide_height = Inches(7.5)

# Refined color palette - Elegant dark navy with teal accents
BG_DARK = RGBColor(10, 15, 30)
BG_NAVY = RGBColor(12, 20, 40)
BG_CARD = RGBColor(18, 28, 50)
BG_CARD_ALT = RGBColor(22, 34, 58)
TEAL = RGBColor(0, 188, 180)
TEAL_DARK = RGBColor(0, 150, 144)
GOLD = RGBColor(212, 175, 55)
CORAL = RGBColor(232, 93, 93)
LAVENDER = RGBColor(139, 128, 232)
SKY = RGBColor(82, 168, 247)
WHITE = RGBColor(245, 247, 250)
LIGHT = RGBColor(200, 210, 225)
MUTED = RGBColor(140, 155, 180)
BORDER = RGBColor(40, 55, 85)
ACCENT_GREEN = RGBColor(72, 199, 142)

def set_bg(slide, color):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_shape(slide, shape_type, x, y, w, h, fill_color, line=False):
    shape = slide.shapes.add_shape(shape_type, x, y, w, h)
    shape.fill.solid()
    shape.fill.fore_color.rgb = fill_color
    if not line:
        shape.line.fill.background()
    return shape

def add_text(slide, x, y, w, h, text, size=18, color=WHITE, bold=False, align=PP_ALIGN.LEFT, font="Calibri"):
    txBox = slide.shapes.add_textbox(x, y, w, h)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(size)
    p.font.color.rgb = color
    p.font.bold = bold
    p.font.name = font
    p.alignment = align
    return txBox

def add_multiline(slide, x, y, w, h, lines, size=14, color=LIGHT, bold=False, align=PP_ALIGN.LEFT, spacing=1.2):
    txBox = slide.shapes.add_textbox(x, y, w, h)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, line in enumerate(lines):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = line
        p.font.size = Pt(size)
        p.font.color.rgb = color
        p.font.bold = bold
        p.font.name = "Calibri"
        p.alignment = align
        p.space_after = Pt(size * (spacing - 1))
    return txBox

def add_accent_line(slide, x, y, w, color=TEAL):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, Pt(3))
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()

def add_card(slide, x, y, w, h, bg=BG_CARD):
    return add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h, bg)

def add_section_label(slide, text, x=Inches(0.6), y=Inches(0.5)):
    shape = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.2), Inches(0.32), TEAL_DARK)
    tf = shape.text_frame
    tf.paragraphs[0].text = text
    tf.paragraphs[0].font.size = Pt(9)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.name = "Calibri"
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER

def add_page_number(slide, num, total):
    add_text(slide, Inches(12.3), Inches(7.05), Inches(0.8), Inches(0.3),
        f"{num}/{total}", 9, MUTED, False, PP_ALIGN.RIGHT)

# ================================================================
# SLIDE 1 - TITLE
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

# Decorative circles (subtle background accents)
for cx, cy, r, c in [(Inches(0.5), Inches(0.5), 1.8, TEAL), (Inches(11), Inches(5), 1.4, GOLD), (Inches(11.5), Inches(0.5), 0.9, LAVENDER)]:
    shape = add_shape(slide, MSO_SHAPE.OVAL, cx, cy, Inches(r), Inches(r), c)
    # Keep solid but use very muted versions of colors
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(
        min(255, c[0] // 6),
        min(255, c[1] // 6),
        min(255, c[2] // 6)
    )

add_text(slide, Inches(1.5), Inches(2.0), Inches(10.3), Inches(0.5),
    "IST 2107  |  Case Study", 14, TEAL, True, PP_ALIGN.CENTER)
add_accent_line(slide, Inches(5.5), Inches(2.55), Inches(2.3))
add_text(slide, Inches(1), Inches(2.8), Inches(11.3), Inches(1.4),
    "Student Project\nManagement System", 52, WHITE, True, PP_ALIGN.CENTER)
add_text(slide, Inches(2), Inches(4.4), Inches(9.3), Inches(0.6),
    "Makerere University  |  College of Computing & Information Sciences", 18, LIGHT, False, PP_ALIGN.CENTER)

# Bottom info bar
add_shape(slide, MSO_SHAPE.RECTANGLE, 0, Inches(6.2), Inches(13.333), Inches(1.3), BG_CARD)
info_items = [("UGX 450M", "Budget"), ("10 Months", "Duration"), ("9 Modules", "Features"), ("5 Presenters", "Team")]
for i, (val, label) in enumerate(info_items):
    cx = Inches(1.8 + i * 2.8)
    add_text(slide, cx, Inches(6.35), Inches(2), Inches(0.4), val, 22, TEAL, True, PP_ALIGN.CENTER)
    add_text(slide, cx, Inches(6.75), Inches(2), Inches(0.3), label, 10, MUTED, False, PP_ALIGN.CENTER)

add_page_number(slide, 1, 13)

# ================================================================
# SLIDE 2 - TABLE OF CONTENTS
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_text(slide, Inches(0.6), Inches(0.5), Inches(12), Inches(0.7), "Agenda", 38, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.15), Inches(1.5))

toc_items = [
    ("01", "Project Overview", "Understanding the SPMS initiative"),
    ("02", "Stakeholder Analysis", "Key interests and engagement strategies"),
    ("03", "Project Charter", "Objectives, scope, and constraints"),
    ("04", "Work Breakdown Structure", "Three-level decomposition"),
    ("05", "Project Schedule", "Gantt chart and milestones"),
    ("06", "Risk Management", "Risk register and mitigation"),
    ("07", "Communication Plan", "Stakeholder engagement framework"),
    ("08", "Methodology", "Hybrid approach justification"),
    ("09", "Success Factors", "Critical success criteria"),
    ("10", "Reflection", "Delay response and lessons learned"),
]
for i, (num, title, desc) in enumerate(toc_items):
    col = i % 2
    row = i // 2
    x = Inches(0.6 + col * 6.3)
    y = Inches(1.6 + row * 1.1)
    add_card(slide, x, y, Inches(5.9), Inches(0.95), BG_CARD)
    add_text(slide, x + Inches(0.2), y + Inches(0.12), Inches(0.6), Inches(0.4), num, 20, TEAL, True)
    add_text(slide, x + Inches(0.9), y + Inches(0.1), Inches(4.5), Inches(0.35), title, 15, WHITE, True)
    add_text(slide, x + Inches(0.9), y + Inches(0.48), Inches(4.5), Inches(0.35), desc, 10, MUTED)

add_page_number(slide, 2, 13)

# ================================================================
# SLIDE 3 - PROJECT OVERVIEW
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION A")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Project Overview", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

# Problem statement card
add_card(slide, Inches(0.6), Inches(2.1), Inches(7.5), Inches(2.0), BG_CARD)
add_text(slide, Inches(0.9), Inches(2.2), Inches(7), Inches(0.4), "The Problem", 18, CORAL, True)
problems = [
    "> Students miss important deadlines",
    "> Supervisors exceed recommended workload",
    "> Progress reports are difficult to monitor",
    "> Communication is inconsistent",
    "> Final submissions are delayed",
    "> Records are difficult to retrieve",
]
add_multiline(slide, Inches(0.9), Inches(2.65), Inches(7), Inches(1.3), problems, 12, LIGHT)

# Why it's a project card
add_card(slide, Inches(8.4), Inches(2.1), Inches(4.5), Inches(2.0), BG_CARD)
add_text(slide, Inches(8.7), Inches(2.2), Inches(4), Inches(0.4), "Why a Project?", 18, TEAL, True)
why_items = [
    "> Temporary (10 months, fixed end)",
    "> Unique deliverable (custom system)",
    "> Progressive elaboration",
    "> Resource constraints (budget/time)",
    "> Risk and uncertainty present",
]
add_multiline(slide, Inches(8.7), Inches(2.65), Inches(4), Inches(1.3), why_items, 12, LIGHT)

# Solution card
add_card(slide, Inches(0.6), Inches(4.3), Inches(12.3), Inches(2.8), BG_CARD)
add_text(slide, Inches(0.9), Inches(4.4), Inches(11.7), Inches(0.4), "The Proposed Solution: SPMS", 18, GOLD, True)

solution_cols = [
    ["Online proposal submission", "Supervisor allocation", "Milestone tracking", "Progress reporting"],
    ["Meeting scheduling", "Notifications & reminders", "Document management", "Project assessment"],
]
for col_idx, col_items in enumerate(solution_cols):
    x = Inches(0.9 + col_idx * 5.5)
    add_multiline(slide, x, Inches(4.85), Inches(5), Inches(1.8), 
        [f"  {item}" for item in col_items], 13, LIGHT)

add_page_number(slide, 3, 13)

# ================================================================
# SLIDE 4 - STAKEHOLDER ANALYSIS
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION B")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Stakeholder Analysis", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

stakeholders = [
    ("University Management", "ROI on UGX 450M; improved graduation rates; institutional reputation", "High", "High"),
    ("Deputy Principal", "Sponsor visibility; on-time delivery; project success", "High", "High"),
    ("Students", "Easy submission; clear deadlines; timely feedback; transparency", "High", "Medium"),
    ("Academic Staff", "Manageable workload; efficient communication; fair allocation", "Medium", "High"),
    ("ICT Support Unit", "Maintainability; integration feasibility; security compliance", "Medium", "Medium"),
    ("Department Heads", "Smooth operations; workload balance; reporting access", "Medium", "Medium"),
]

# Table header
headers = ["Stakeholder", "Interest", "Power", "Influence"]
widths = [Inches(2.5), Inches(6.5), Inches(1.5), Inches(1.5)]
x_start = Inches(0.6)
y = Inches(2.0)
x = x_start
for header, w in zip(headers, widths):
    shape = add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.45), TEAL_DARK)
    tf = shape.text_frame
    tf.margin_left = Pt(10)
    tf.paragraphs[0].text = header
    tf.paragraphs[0].font.size = Pt(11)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.name = "Calibri"
    x += w

for i, (name, interest, power, influence) in enumerate(stakeholders):
    y = Inches(2.5 + i * 0.75)
    bg = BG_CARD if i % 2 == 0 else BG_NAVY
    x = x_start
    for j, (val, w) in enumerate(zip([name, interest, power, influence], widths)):
        shape = add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.65), bg)
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Pt(10)
        tf.paragraphs[0].text = val
        tf.paragraphs[0].font.size = Pt(11)
        tf.paragraphs[0].font.name = "Calibri"
        if j == 0:
            tf.paragraphs[0].font.color.rgb = TEAL
            tf.paragraphs[0].font.bold = True
        elif val == "High":
            tf.paragraphs[0].font.color.rgb = CORAL
            tf.paragraphs[0].font.bold = True
        else:
            tf.paragraphs[0].font.color.rgb = LIGHT
        x += w

add_page_number(slide, 4, 13)

# ================================================================
# SLIDE 5 - PROJECT CHARTER
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION A")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Project Charter", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

# Metric boxes
metrics = [("UGX 450M", "Budget"), ("10", "Months"), ("9", "Features"), ("6", "Deliverables")]
for i, (val, label) in enumerate(metrics):
    x = Inches(0.6 + i * 3.1)
    add_card(slide, x, Inches(2.1), Inches(2.8), Inches(1.1), BG_CARD)
    add_text(slide, x, Inches(2.2), Inches(2.8), Inches(0.5), val, 26, TEAL, True, PP_ALIGN.CENTER)
    add_text(slide, x, Inches(2.7), Inches(2.8), Inches(0.3), label, 11, MUTED, False, PP_ALIGN.CENTER)

# Objectives
add_card(slide, Inches(0.6), Inches(3.5), Inches(6.0), Inches(3.6), BG_CARD)
add_text(slide, Inches(0.9), Inches(3.6), Inches(5.4), Inches(0.4), "Project Objectives", 18, GOLD, True)
objectives = [
    "> Deliver functional SPMS within 10 months",
    "> Complete within UGX 450M budget",
    "> Achieve >=80% user adoption in 3 months post-launch",
    "> Seamless ACMIS integration",
    "> Full data security & privacy compliance",
]
add_multiline(slide, Inches(0.9), Inches(4.1), Inches(5.4), Inches(2.5), objectives, 13, LIGHT)

# Scope
add_card(slide, Inches(6.9), Inches(3.5), Inches(6.0), Inches(3.6), BG_CARD)
add_text(slide, Inches(7.2), Inches(3.6), Inches(5.4), Inches(0.4), "System Features", 18, GOLD, True)
features = [
    "> Online proposal submission",
    "> Supervisor allocation engine",
    "> Milestone tracking & progress reporting",
    "> Meeting scheduling & notifications",
    "> Document management (version control)",
    "> Project assessment & grading",
    "> Report generation for coordinators",
]
add_multiline(slide, Inches(7.2), Inches(4.1), Inches(5.4), Inches(2.5), features, 13, LIGHT)

add_page_number(slide, 5, 13)

# ================================================================
# SLIDE 6 - WBS (Part 1)
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION D")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Work Breakdown Structure", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

wbs_top = [
    ("1", "Project Initiation & Planning", TEAL, [
        "1.1 Charter  |  1.2 Stakeholder Analysis  |  1.3 Requirements  |  1.4 Sign-off  |  1.5 Plan Baseline"
    ]),
    ("2", "System Design", SKY, [
        "2.1 Database  |  2.2 Architecture  |  2.3 UI/UX  |  2.4 ACMIS Design  |  2.5 Design Review"
    ]),
    ("3", "Development", ACCENT_GREEN, [
        "3.1 Auth/RBAC  |  3.2 Proposals  |  3.3 Allocation  |  3.4 Milestones  |  3.5 Scheduling",
        "3.6 Documents  |  3.7 Assessment  |  3.8 Reports  |  3.9 ACMIS Integration"
    ]),
]

for i, (num, title, color, items) in enumerate(wbs_top):
    y = Inches(2.1 + i * 1.65)
    add_card(slide, Inches(0.6), y, Inches(12.1), Inches(1.5), BG_CARD)
    # Number circle
    circle = add_shape(slide, MSO_SHAPE.OVAL, Inches(0.8), y + Inches(0.3), Inches(0.55), Inches(0.55), color)
    tf = circle.text_frame
    tf.paragraphs[0].text = num
    tf.paragraphs[0].font.size = Pt(16)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].font.name = "Calibri"
    # Title
    add_text(slide, Inches(1.55), y + Inches(0.15), Inches(11), Inches(0.4), title, 16, color, True)
    # Items
    add_multiline(slide, Inches(1.55), y + Inches(0.55), Inches(11), Inches(0.8), items, 11, MUTED)

add_page_number(slide, 6, 13)

# ================================================================
# SLIDE 7 - WBS (Part 2)
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_NAVY)

add_section_label(slide, "SECTION D (cont.)")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Work Breakdown Structure", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

wbs_bottom = [
    ("4", "Testing & QA", GOLD, [
        "4.1 Unit  |  4.2 Integration  |  4.3 System  |  4.4 Security  |  4.5 Performance  |  4.6 UAT"
    ]),
    ("5", "Deployment & Training", CORAL, [
        "5.1 Prod Setup  |  5.2 Migration  |  5.3 Go-Live  |  5.4 Training  |  5.5 Hypercare"
    ]),
    ("6", "Project Closure", LAVENDER, [
        "6.1 Documentation  |  6.2 Lessons Learned  |  6.3 ICT Transition  |  6.4 Sign-off"
    ]),
]

for i, (num, title, color, items) in enumerate(wbs_bottom):
    y = Inches(2.1 + i * 1.65)
    add_card(slide, Inches(0.6), y, Inches(12.1), Inches(1.5), BG_CARD)
    circle = add_shape(slide, MSO_SHAPE.OVAL, Inches(0.8), y + Inches(0.3), Inches(0.55), Inches(0.55), color)
    tf = circle.text_frame
    tf.paragraphs[0].text = num
    tf.paragraphs[0].font.size = Pt(16)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].font.name = "Calibri"
    add_text(slide, Inches(1.55), y + Inches(0.15), Inches(11), Inches(0.4), title, 16, color, True)
    add_multiline(slide, Inches(1.55), y + Inches(0.55), Inches(11), Inches(0.8), items, 11, MUTED)

# Summary note
add_card(slide, Inches(0.6), Inches(6.2), Inches(12.1), Inches(0.8), BG_CARD)
add_text(slide, Inches(0.9), Inches(6.3), Inches(11.5), Inches(0.6),
    "Total: 6 major phases  |  30+ work packages  |  3 levels of decomposition", 12, MUTED, False, PP_ALIGN.CENTER)

add_page_number(slide, 7, 13)

# ================================================================
# SLIDE 8 - GANTT CHART
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_text(slide, Inches(0.6), Inches(0.5), Inches(12), Inches(0.7), "Project Schedule", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.15), Inches(2.0))

# Month headers
for m in range(10):
    x = Inches(3.2 + m * 0.98)
    shape = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.5), Inches(0.88), Inches(0.38), TEAL_DARK)
    tf = shape.text_frame
    tf.paragraphs[0].text = f"M{m+1}"
    tf.paragraphs[0].font.size = Pt(10)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].font.name = "Calibri"

gantt = [
    ("Initiation & Planning", 0, 2, TEAL),
    ("System Design", 2, 2, SKY),
    ("Development", 3, 4, ACCENT_GREEN),
    ("Testing & QA", 6, 3, GOLD),
    ("Deployment & Training", 8, 2, CORAL),
    ("Project Closure", 9, 1, LAVENDER),
]

for i, (name, start, dur, color) in enumerate(gantt):
    y = Inches(2.1 + i * 0.75)
    add_text(slide, Inches(0.4), y + Inches(0.05), Inches(2.7), Inches(0.4), name, 12, LIGHT, False, PP_ALIGN.RIGHT)
    bar_x = Inches(3.2 + start * 0.98)
    bar_w = Inches(dur * 0.98)
    shape = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, bar_x, y + Inches(0.05), bar_w, Inches(0.4), color)
    tf = shape.text_frame
    tf.paragraphs[0].text = f"{dur} mo"
    tf.paragraphs[0].font.size = Pt(10)
    tf.paragraphs[0].font.color.rgb = BG_DARK
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].font.name = "Calibri"

# Legend
add_shape(slide, MSO_SHAPE.RECTANGLE, 0, Inches(6.5), Inches(13.333), Inches(1), BG_CARD)
legend = [("Initiation", TEAL), ("Design", SKY), ("Development", ACCENT_GREEN), ("Testing", GOLD), ("Deployment", CORAL), ("Closure", LAVENDER)]
for i, (label, col) in enumerate(legend):
    x = Inches(1.2 + i * 2.0)
    shape = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(6.7), Inches(0.3), Inches(0.3), col)
    add_text(slide, x + Inches(0.4), Inches(6.72), Inches(1.3), Inches(0.3), label, 10, MUTED)

add_page_number(slide, 8, 13)

# ================================================================
# SLIDE 9 - MILESTONES
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_NAVY)

add_text(slide, Inches(0.6), Inches(0.5), Inches(12), Inches(0.7), "Project Milestones", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.15), Inches(2.0))

milestones = [
    ("MONTH 2", "Requirements Baseline Signed", "All stakeholder groups sign off on SRS document", TEAL),
    ("MONTH 4", "Design Complete & Approved", "Architecture, DB, UI, integration designs reviewed & approved", SKY),
    ("MONTH 6", "Core Functionality Demo (Alpha)", "All 9 features demonstrable; unit tests >= 80% coverage", ACCENT_GREEN),
    ("MONTH 9", "UAT Pass & Go-Live Readiness", "UAT sign-off from all 3 user groups; production env ready", GOLD),
    ("MONTH 10", "System Live & Project Closure", "SPMS in production; zero critical bugs; closure report approved", CORAL),
]

# Vertical timeline line
shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(3.0), Inches(1.6), Pt(2), Inches(5.5))
shape.fill.solid()
shape.fill.fore_color.rgb = BORDER
shape.line.fill.background()

for i, (month, title, desc, color) in enumerate(milestones):
    y = Inches(1.7 + i * 1.1)
    # Dot on timeline
    dot = add_shape(slide, MSO_SHAPE.OVAL, Inches(2.88), y + Inches(0.15), Inches(0.26), Inches(0.26), color)
    # Month label
    shape = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.6), y + Inches(0.08), Inches(2.0), Inches(0.38), color)
    tf = shape.text_frame
    tf.paragraphs[0].text = month
    tf.paragraphs[0].font.size = Pt(10)
    tf.paragraphs[0].font.color.rgb = BG_DARK
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].font.name = "Calibri"
    # Title & description
    add_text(slide, Inches(3.4), y, Inches(9.5), Inches(0.35), title, 16, WHITE, True)
    add_text(slide, Inches(3.4), y + Inches(0.38), Inches(9.5), Inches(0.4), desc, 12, MUTED)

add_page_number(slide, 9, 13)

# ================================================================
# SLIDE 10 - RISK REGISTER
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION F")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Risk Register", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

risks = [
    ("1", "Lecturers unavailable during semester", "High", "High", "Schedule workshops during breaks; assign proxy reps"),
    ("2", "ACMIS integration API changes/delays", "Medium", "High", "Early MoU with ICT; adapter layer; mock API"),
    ("3", "Scope creep from stakeholders", "High", "Medium", "Strict CCB; MoSCoW prioritization; scope freeze"),
    ("4", "Resistance to change from senior staff", "High", "Medium", "Early engagement; champions; mandatory training"),
    ("5", "Budget overrun from complexity", "Medium", "High", "Monthly tracking; 10% contingency; Phase 2 deferral"),
]

headers = ["#", "Risk Description", "Prob.", "Impact", "Mitigation Strategy"]
widths = [Inches(0.4), Inches(3.2), Inches(0.9), Inches(0.9), Inches(7.1)]
x_start = Inches(0.6)
y = Inches(2.0)
x = x_start
for header, w in zip(headers, widths):
    shape = add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.42), TEAL_DARK)
    tf = shape.text_frame
    tf.margin_left = Pt(6)
    tf.paragraphs[0].text = header
    tf.paragraphs[0].font.size = Pt(10)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.name = "Calibri"
    x += w

for i, (num, risk, prob, impact, mitigation) in enumerate(risks):
    y = Inches(2.48 + i * 0.82)
    bg = BG_CARD if i % 2 == 0 else BG_NAVY
    x = x_start
    for j, (val, w) in enumerate(zip([num, risk, prob, impact, mitigation], widths)):
        shape = add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.72), bg)
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Pt(6)
        tf.paragraphs[0].text = val
        tf.paragraphs[0].font.size = Pt(10)
        tf.paragraphs[0].font.name = "Calibri"
        if j == 0:
            tf.paragraphs[0].font.color.rgb = TEAL
            tf.paragraphs[0].font.bold = True
        elif val == "High":
            tf.paragraphs[0].font.color.rgb = CORAL
            tf.paragraphs[0].font.bold = True
        elif val == "Medium":
            tf.paragraphs[0].font.color.rgb = GOLD
            tf.paragraphs[0].font.bold = True
        else:
            tf.paragraphs[0].font.color.rgb = LIGHT
        x += w

add_page_number(slide, 10, 13)

# ================================================================
# SLIDE 11 - COMMUNICATION PLAN
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_NAVY)

add_text(slide, Inches(0.6), Inches(0.5), Inches(12), Inches(0.7), "Communication Plan", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.15), Inches(2.0))

comm = [
    ("Sponsor / Deputy Principal", "Bi-weekly", "Face-to-face + email", "PM", "Progress & escalations"),
    ("Development Team", "Daily", "Stand-up + Slack/Teams", "PM", "Blockers & sprint progress"),
    ("Department Heads", "Monthly", "Email + dept meetings", "PM", "Status & resource requests"),
    ("Academic Staff", "Monthly", "Email + portal", "Coordinator", "Demos & training schedule"),
    ("Students", "Bi-weekly", "Portal + social media", "Coordinator", "Updates & training dates"),
    ("ICT Support Unit", "Weekly", "Slack + sync meetings", "Dev Lead", "Integration & security"),
]

headers = ["Audience", "Frequency", "Channel", "Owner", "Purpose"]
widths = [Inches(2.8), Inches(1.6), Inches(2.8), Inches(1.4), Inches(3.7)]
x_start = Inches(0.6)
y = Inches(1.5)
x = x_start
for header, w in zip(headers, widths):
    shape = add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.42), TEAL_DARK)
    tf = shape.text_frame
    tf.margin_left = Pt(8)
    tf.paragraphs[0].text = header
    tf.paragraphs[0].font.size = Pt(11)
    tf.paragraphs[0].font.color.rgb = WHITE
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].font.name = "Calibri"
    x += w

for i, row in enumerate(comm):
    y = Inches(1.98 + i * 0.68)
    bg = BG_CARD if i % 2 == 0 else BG_DARK
    x = x_start
    for j, (val, w) in enumerate(zip(row, widths)):
        shape = add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, w, Inches(0.58), bg)
        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = Pt(8)
        tf.paragraphs[0].text = val
        tf.paragraphs[0].font.size = Pt(10)
        tf.paragraphs[0].font.name = "Calibri"
        tf.paragraphs[0].font.color.rgb = TEAL if j == 0 else LIGHT
        tf.paragraphs[0].font.bold = j == 0
        x += w

# Escalation
add_card(slide, Inches(0.6), Inches(6.0), Inches(12.1), Inches(1.0), BG_CARD)
add_text(slide, Inches(0.9), Inches(6.1), Inches(11.5), Inches(0.35), "Escalation Path", 14, GOLD, True)
add_text(slide, Inches(0.9), Inches(6.45), Inches(11.5), Inches(0.4),
    "Level 1: Dev Lead  >  Project Manager    |    Level 2: PM  >  Sponsor    |    Level 3: Sponsor  >  University Council", 12, LIGHT)

add_page_number(slide, 11, 13)

# ================================================================
# SLIDE 12 - METHODOLOGY
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION E")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Recommended Methodology: Hybrid", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

phases = [
    ("Initiation > Design", "WATERFALL", TEAL, [
        "Fixed scope & budget",
        "Compliance requirements",
        "Signed baselines needed"
    ]),
    ("Development > Testing", "AGILE (SCRUM)", ACCENT_GREEN, [
        "2-week sprints",
        "User feedback loops",
        "Early demos reduce risk"
    ]),
    ("Deployment > Closure", "WATERFALL", CORAL, [
        "Irreversible go-live",
        "Fixed training schedule",
        "Formal sign-off required"
    ]),
]

for i, (phase, method, color, items) in enumerate(phases):
    x = Inches(0.6 + i * 4.15)
    add_card(slide, x, Inches(2.1), Inches(3.85), Inches(3.0), BG_CARD)
    # Phase title
    add_text(slide, x + Inches(0.2), Inches(2.2), Inches(3.45), Inches(0.35), phase, 14, MUTED, False, PP_ALIGN.CENTER)
    # Method badge
    shape = add_shape(slide, MSO_SHAPE.ROUNDED_RECTANGLE, x + Inches(0.8), Inches(2.6), Inches(2.25), Inches(0.4), color)
    tf = shape.text_frame
    tf.paragraphs[0].text = method
    tf.paragraphs[0].font.size = Pt(12)
    tf.paragraphs[0].font.color.rgb = BG_DARK
    tf.paragraphs[0].font.bold = True
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].font.name = "Calibri"
    # Items
    add_multiline(slide, x + Inches(0.3), Inches(3.15), Inches(3.3), Inches(1.5),
        [f"  {item}" for item in items], 12, LIGHT)

# Why cards
add_card(slide, Inches(0.6), Inches(5.3), Inches(6.0), Inches(1.8), BG_CARD)
add_text(slide, Inches(0.9), Inches(5.4), Inches(5.4), Inches(0.35), "Why NOT Pure Waterfall?", 14, CORAL, True)
add_multiline(slide, Inches(0.9), Inches(5.8), Inches(5.4), Inches(1.1), [
    "> Lecturers unavailable during semester",
    "> Users resist change without early demos",
    "> Requirements evolve after first review",
], 11, LIGHT)

add_card(slide, Inches(6.9), Inches(5.3), Inches(6.0), Inches(1.8), BG_CARD)
add_text(slide, Inches(7.2), Inches(5.4), Inches(5.4), Inches(0.35), "Why NOT Pure Agile?", 14, GOLD, True)
add_multiline(slide, Inches(7.2), Inches(5.8), Inches(5.4), Inches(1.1), [
    "> Fixed budget/deadline needs upfront planning",
    "> ACMIS integration contract is fixed",
    "> University procurement requires specs",
], 11, LIGHT)

add_page_number(slide, 12, 13)

# ================================================================
# SLIDE 13 - SUCCESS FACTORS
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION H")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Critical Success Factors", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

csfs = [
    ("Executive Sponsorship", "Deputy Principal unblocks resources, resolves conflicts, signals importance to resistant staff", TEAL),
    ("Early User Involvement", "Lecturers available intermittently; students validate UX; prevents 'built but unused'", SKY),
    ("Scope & Change Control", "Fixed budget/deadline means scope creep = failure; MoSCoW + CCB essential", GOLD),
    ("ACMIS Integration", "Single source of truth for student data; failure = duplicate entry, errors, distrust", ACCENT_GREEN),
    ("Training & Change Mgmt", "Resistance is a named constraint; champions + workshops drive adoption", LAVENDER),
    ("Skilled Core Team", "Communication kills velocity; dedicated devs + PM + QA = accountability", CORAL),
]

for i, (title, desc, color) in enumerate(csfs):
    col = i % 2
    row = i // 2
    x = Inches(0.6 + col * 6.3)
    y = Inches(2.1 + row * 1.65)
    add_card(slide, x, y, Inches(5.9), Inches(1.5), BG_CARD)
    # Color accent bar on left
    add_shape(slide, MSO_SHAPE.RECTANGLE, x, y, Pt(4), Inches(1.5), color)
    add_text(slide, x + Inches(0.25), y + Inches(0.1), Inches(5.4), Inches(0.35), title, 15, color, True)
    add_text(slide, x + Inches(0.25), y + Inches(0.5), Inches(5.4), Inches(0.85), desc, 11, LIGHT)

# KPI bar
add_shape(slide, MSO_SHAPE.RECTANGLE, 0, Inches(6.8), Inches(13.333), Inches(0.7), BG_CARD)
kpis = [("> = 80%", "User Adoption Target"), ("< = 10", "Months Duration"), ("100%", "Budget Compliance")]
for i, (val, label) in enumerate(kpis):
    cx = Inches(2.0 + i * 3.3)
    add_text(slide, cx, Inches(6.82), Inches(2.5), Inches(0.35), val, 20, TEAL, True, PP_ALIGN.CENTER)
    add_text(slide, cx, Inches(7.1), Inches(2.5), Inches(0.3), label, 9, MUTED, False, PP_ALIGN.CENTER)

add_page_number(slide, 13, 13)

# ================================================================
# SLIDE 14 - REFLECTION
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_NAVY)

add_section_label(slide, "REFLECTION")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "4-Month Delay: Response Plan", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

# Actions
add_card(slide, Inches(0.6), Inches(2.1), Inches(6.0), Inches(2.5), BG_CARD)
add_text(slide, Inches(0.9), Inches(2.2), Inches(5.4), Inches(0.35), "Actions as Project Manager", 16, CORAL, True)
add_multiline(slide, Inches(0.9), Inches(2.6), Inches(5.4), Inches(1.8), [
    "1. Emergency steering committee meeting",
    "2. Present impact assessment & recovery options",
    "3. Re-baseline: crash or reduce scope to MVP",
    "4. Negotiate new deadline (Month 14)",
    "5. Formal root cause analysis",
], 12, LIGHT)

# Knowledge areas
add_card(slide, Inches(6.9), Inches(2.1), Inches(6.0), Inches(2.5), BG_CARD)
add_text(slide, Inches(7.2), Inches(2.2), Inches(5.4), Inches(0.35), "Affected Knowledge Areas", 16, GOLD, True)
add_multiline(slide, Inches(7.2), Inches(2.6), Inches(5.4), Inches(1.8), [
    "> Schedule Management - baseline broken",
    "> Scope Management - reduction required",
    "> Stakeholder Mgmt - trust damaged",
    "> Communications - urgent updates needed",
    "> Risk Mgmt - late requirements materialized",
], 12, LIGHT)

# Communication
add_card(slide, Inches(0.6), Inches(4.8), Inches(6.0), Inches(2.3), BG_CARD)
add_text(slide, Inches(0.9), Inches(4.9), Inches(5.4), Inches(0.35), "Stakeholder Communication", 16, SKY, True)
add_multiline(slide, Inches(0.9), Inches(5.3), Inches(5.4), Inches(1.5), [
    "> Sponsor: Face-to-face + formal memo (Day 1)",
    "> Dept Heads: Email + meetings (Day 2)",
    "> Students: Portal announcement (Day 3)",
    "> Dev Team: Stand-up + revised plan (Day 1)",
], 12, LIGHT)

# Lessons
add_card(slide, Inches(6.9), Inches(4.8), Inches(6.0), Inches(2.3), BG_CARD)
add_text(slide, Inches(7.2), Inches(4.9), Inches(5.4), Inches(0.35), "Lessons for Future Projects", 16, ACCENT_GREEN, True)
add_multiline(slide, Inches(7.2), Inches(5.3), Inches(5.4), Inches(1.5), [
    "> Lock requirements before semester",
    "> MoUs with dependency owners",
    "> Contingency for academic calendar",
    "> Proxy user representatives",
    "> Pilot with 1 department first",
], 12, LIGHT)

add_page_number(slide, 14, 14)

# ================================================================
# SLIDE 15 - TRIPLE CONSTRAINT + Q&A
# ================================================================
slide = prs.slides.add_slide(prs.slide_layouts[6])
set_bg(slide, BG_DARK)

add_section_label(slide, "SECTION G")
add_text(slide, Inches(0.6), Inches(1.0), Inches(12), Inches(0.7), "Triple Constraint", 36, WHITE, True)
add_accent_line(slide, Inches(0.6), Inches(1.65), Inches(2.0))

constraints = [
    ("Scope > Cost", "Adding 'mobile app' (+UGX 80M) exceeds budget. Requires additional funding or descoping.", SKY),
    ("Scope > Time", "Adding 'plagiarism checker' pushes timeline 6 weeks. Misses academic year deadline.", ACCENT_GREEN),
    ("Scope > Quality", "Fixed time/budget + more scope = rushed testing. Data breach risk. Poor UX = low adoption.", CORAL),
]

for i, (title, desc, color) in enumerate(constraints):
    x = Inches(0.6 + i * 4.15)
    add_card(slide, x, Inches(2.1), Inches(3.85), Inches(2.2), BG_CARD)
    add_shape(slide, MSO_SHAPE.RECTANGLE, x, Inches(2.1), Inches(3.85), Pt(4), color)
    add_text(slide, x + Inches(0.2), Inches(2.3), Inches(3.45), Inches(0.4), title, 16, color, True, PP_ALIGN.CENTER)
    add_text(slide, x + Inches(0.2), Inches(2.8), Inches(3.45), Inches(1.3), desc, 12, LIGHT)

# Trade-off box
add_card(slide, Inches(2.0), Inches(4.6), Inches(9.3), Inches(1.2), BG_CARD)
add_text(slide, Inches(2.3), Inches(4.7), Inches(8.7), Inches(0.35), "Trade-off Triangle", 16, GOLD, True, PP_ALIGN.CENTER)
add_text(slide, Inches(2.3), Inches(5.1), Inches(8.7), Inches(0.5),
    "Fixed Time (10 months) + Fixed Cost (UGX 450M)  =>  Scope must be controlled via Change Control Board", 12, LIGHT, False, PP_ALIGN.CENTER)

# Q&A section
add_shape(slide, MSO_SHAPE.RECTANGLE, 0, Inches(6.0), Inches(13.333), Inches(1.5), BG_CARD)
add_text(slide, Inches(1), Inches(6.2), Inches(11.3), Inches(0.6), "Questions & Discussion", 34, WHITE, True, PP_ALIGN.CENTER)
add_accent_line(slide, Inches(5.5), Inches(6.85), Inches(2.3))
add_text(slide, Inches(1), Inches(7.0), Inches(11.3), Inches(0.4), "Thank you for your attention", 14, MUTED, False, PP_ALIGN.CENTER)

add_page_number(slide, 15, 15)

# ===== SAVE =====
output_path = r"C:\Users\twata\ACCWARE\IST2107_SPMS_Presentation.pptx"
prs.save(output_path)
print(f"Saved: {output_path}")
print(f"Total slides: {len(prs.slides)}")
