from google import genai

# Inisialisasi klien (ganti dengan API key Anda)
client = genai.Client(api_key="AIzaSyDDMvfxCY_DWqYllvNP2ytx1zh1JG5Xl28")

# Meminta respons dari model tercepat dan terbaru (Gemini 3 Flash)
response = client.models.generate_content(
    model="gemini-3-flash-preview",
    contents="Jelaskan apa itu kecerdasan buatan dalam 3 kata",
)

print(response.text)