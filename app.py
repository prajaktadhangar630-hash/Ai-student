from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/analyze", methods=["POST"])
def analyze():

    data = request.json

    support = {}
    difficulty_areas = []

    for area, score in data.items():

        if score < 50:
            level = "Needs Support"
            difficulty_areas.append(area)

        elif score < 75:
            level = "Needs Practice"

        else:
            level = "Doing Well"

        support[area] = {
            "score": score,
            "level": level
        }

    if difficulty_areas:
        overall = "Additional learning support recommended"
    else:
        overall = "Learning performance is satisfactory"

    return jsonify({
        "overall": overall,
        "difficultyAreas": difficulty_areas,
        "analysis": support
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)