import ExpoModulesCore
import Foundation
import CoreML
import Vision

func predictObject(modelURL: URL, imageURL: URL, promise: Promise) {
    
    do {
        
        let model = try MLModel(contentsOf: modelURL)
        let visionModel = try VNCoreMLModel(for: model)
        let image = CIImage(contentsOf: imageURL)
        
        let request = VNCoreMLRequest(model: visionModel) { (request, error) in
            if let error = error {
                promise.resolve(NSNull())
              return
            }
            
            guard let results = request.results as? [VNRecognizedObjectObservation] else {
                promise.resolve(NSNull())
              return
            }

            let predictionResults = results.map { [
                "confidence": $0.confidence,
                "label": $0.labels.first?.identifier ?? "",
                "boundingBox": [
                    "x": $0.boundingBox.origin.x,
                    "y": $0.boundingBox.origin.y,
                    "width": $0.boundingBox.size.width,
                    "height": $0.boundingBox.size.height
                ],
            ] }
            promise.resolve(predictionResults)
            
      }
        
        let handler = VNImageRequestHandler(ciImage: image!);
        try handler.perform([request]);
      
    } catch {
        promise.resolve("Failed to load the model")
    }
    
}
