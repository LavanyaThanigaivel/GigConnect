import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

# Output file name
output_pdf = "GigConnect_Project_Code.pdf"

# Folders to include
folders = ["frontend", "backend"]

# Folders and files to exclude
excluded_folders = ["node_modules", ".git", "dist", "build", ".vscode"]
excluded_files = ["package-lock.json", ".DS_Store"]

def add_code_to_pdf(c, file_path, y):
    """Add file content to the PDF"""
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            lines = f.readlines()
    except Exception as e:
        print(f"⚠️ Skipped {file_path}: {e}")
        return y

    # Add file path as a header
    c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, f"--- {file_path} ---")
    y -= 15

    # Add file contents
    c.setFont("Courier", 8)
    for line in lines:
        if y <= 50:  # new page
            c.showPage()
            c.setFont("Courier", 8)
            y = 800
        c.drawString(50, y, line.strip("\n")[:110])  # truncate long lines
        y -= 10
    y -= 20
    return y

def main():
    c = canvas.Canvas(output_pdf, pagesize=A4)
    y = 800

    for folder in folders:
        for root, dirs, files in os.walk(folder):
            # Exclude unwanted folders
            dirs[:] = [d for d in dirs if d not in excluded_folders]
            for file in files:
                # Skip unwanted files
                if file in excluded_files:
                    continue
                if file.endswith((".js", ".jsx", ".html", ".css", ".json", ".env", ".md")):
                    file_path = os.path.join(root, file)
                    y = add_code_to_pdf(c, file_path, y)
    
    c.save()
    print(f"✅ All code saved to {output_pdf}")

if __name__ == "__main__":
    main()
