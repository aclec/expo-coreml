import ExpoModulesCore
import Foundation
import CoreML
import Vision

func classifyImage(modelURL: URL, imageURL: URL, promise: Promise) {
    
    do {
        let model = try MLModel(contentsOf: modelURL)
        let visionModel = try VNCoreMLModel(for: model)
        let image = CIImage(contentsOf: imageURL)
        
        let request = VNCoreMLRequest(model: visionModel) { (request, error) in
            if let error = error {
                promise.resolve(NSNull())
                return
            }
            
            guard let results = request.results as? [VNClassificationObservation] else {
                promise.resolve(NSNull())
                return
            }

            let predictionResults = results.map { [
                "confidence": $0.confidence,
                "label": $0.identifier
            ] }
            promise.resolve(predictionResults)
        }
        
        let handler = VNImageRequestHandler(ciImage: image!)
        try handler.perform([request])
      
    } catch {
        promise.resolve("Failed to load the model")
    }
    
}
