import sys
from rembg import remove
import base64

def remove_background(base64_image):
    input_data = base64.b64decode(base64_image)
    output_data = remove(input_data)
    return base64.b64encode(output_data).decode('utf-8')

if __name__ == "__main__":
    base64_image = sys.stdin.read()
    result = remove_background(base64_image)
    print(result)
