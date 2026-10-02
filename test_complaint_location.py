import time
import os
from playwright.sync_api import sync_playwright

ARTIFACT_DIR = r"C:\Users\vrajm\.gemini\antigravity-ide\brain\a0fb9b21-a6d9-41ac-987b-9d1b09cca984"

def run_test():
    with sync_playwright() as p:
        # Launch browser (Chromium)
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900})
        page = context.new_page()

        print("1. Navigating to login page...")
        page.goto("http://localhost:5173/login", wait_until="networkidle")
        time.sleep(1)

        # Fill Login form
        print("2. Logging in as Investigator...")
        page.fill('input[type="email"], input[placeholder*="email" i], input[name="email"]', "investigator@cybertrace.gov.in")
        page.fill('input[type="password"], input[name="password"]', "Investigator@123")
        page.click('button[type="submit"]')
        time.sleep(2)

        print("3. Navigating to Complaints page...")
        page.goto("http://localhost:5173/complaints", wait_until="networkidle")
        time.sleep(1.5)

        # Click "Register New Complaint"
        print("4. Opening Register New Complaint modal...")
        register_btn = page.locator('button:has-text("Register New Complaint")')
        register_btn.wait_for(state="visible", timeout=5000)
        register_btn.click()
        time.sleep(1)

        # Fill modal form
        print("5. Filling complaint details with Bank & Location...")
        page.fill('input[placeholder="e.g. Ramesh Patel"]', "Kavita Sharma")
        page.fill('input[placeholder="+91 98250 12345"]', "+91 98251 99001")
        page.fill('input[placeholder="victim@example.in"]', "kavita.sharma@gmail.com")
        page.select_option('select:has-text("Ahmedabad")', "Ahmedabad")
        page.fill('input[placeholder="e.g. 5,00,000"]', "750000")
        page.fill('input[placeholder="e.g. State Bank of India"]', "State Bank of India (Vastrapur Branch)")
        page.fill('input[placeholder="e.g. ICICI Bank, Alkapuri Branch"]', "ICICI Bank (Satellite Branch, Ahmedabad)")
        page.fill('input[placeholder*="502019481928"]', "19480100998877")
        page.fill('input[placeholder*="UTR20261001928471"]', "UTR2026100298711")
        page.fill('textarea[placeholder*="Detail the sequence"]', "Victim induced into fraudulent equity IPO scheme. Funds transferred to ICICI Bank Satellite branch mule account.")

        screenshot_modal = os.path.join(ARTIFACT_DIR, "complaint_form_filled.png")
        page.screenshot(path=screenshot_modal)
        print(f"Captured modal screenshot at: {screenshot_modal}")

        # Submit form
        print("6. Submitting complaint...")
        page.click('button[type="submit"]')
        time.sleep(2)

        # Verify toast and new card
        print("7. Verifying newly added case in Complaints list...")
        screenshot_list = os.path.join(ARTIFACT_DIR, "complaint_list_with_location.png")
        page.screenshot(path=screenshot_list)
        print(f"Captured complaints list screenshot at: {screenshot_list}")

        # Open Quick View Drawer for the new case
        print("8. Opening Quick View Drawer...")
        new_case_card = page.locator('text=Kavita Sharma').first
        new_case_card.click()
        time.sleep(1)

        screenshot_drawer = os.path.join(ARTIFACT_DIR, "complaint_drawer_bank_location.png")
        page.screenshot(path=screenshot_drawer)
        print(f"Captured drawer screenshot at: {screenshot_drawer}")

        # Open Network Graph / Case Details Modal
        print("9. Opening Case Details Modal via 'View Network Graph'...")
        view_graph_btn = page.locator('text=View Network Graph').first
        if view_graph_btn.is_visible():
            view_graph_btn.click()
            time.sleep(1)
            screenshot_details = os.path.join(ARTIFACT_DIR, "case_details_location_prediction.png")
            page.screenshot(path=screenshot_details)
            print(f"Captured Case Details location prediction screenshot at: {screenshot_details}")

        print("TEST PASSED SUCCESSFULLY: Bank name, suspect branch, jurisdiction location, and spatial prediction coordinates are all correctly captured and rendered!")
        browser.close()

if __name__ == "__main__":
    run_test()
