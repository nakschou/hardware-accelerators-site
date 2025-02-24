# Multiplication is Not What You Need

_Kai Breese · Justin Chou · Katelyn Abille · Lukas Fullner_

![Next Generation Chip Architecture](/images/chip-architecture.jpg)

_Next-generation chip architecture visualization_

## Introduction

As modern artificial intelligence (AI) systems grow in scale and complexity, their computational processes require increasingly large amounts of energy. Notably, ChatGPT required an estimated 564 MWh per day as of February 2023. In comparison, the cost of two days nearly amounts to the total 1,287 MWh used throughout the training phase, highlighting that inference is a major long-term cost [^1]. Similar trends appear in other large-scale models, with Google reporting that 60% of its ML energy usage is dedicated to inference [^2]. These concerns extend beyond cost, as the environmental impact of large-scale AI computation grows. Addressing these challenges requires new hardware solutions that optimize energy efficiency without sacrificing performance.

Addressing this challenge, we aim to investigate a new approach by building on the existing linear-complexity multiplication (lmul) algorithm developed by Luo and Sun [^3], which achieves high precision while reducing computational overhead. Our advancements suggest that lmul could play a critical role in optimizing neural network efficiency. By leveraging lmul, we aim to design a hardware accelerator that optimizes floating-point operations, improving both energy efficiency and computational speed in neural network inference.

To achieve this, we will focus exclusively on PyRTL for development and expand our systolic array beyond the original 2 × 2 design for more efficient floating-point operations. Additionally, we will implement hardware activation units for machine learning functions, such as ReLU and Sigmoid, and benchmark our design against traditional floating-point multipliers. To assess real-world feasibility, we will run machine learning models on our processor and evaluate lmul's performance within an ONNX-based workflow. A comprehensive testing suite will be developed to measure performance metrics and optimize hyperparameters using the generated data. By systematically analyzing our model's efficiency with our data science background, we aim to refine our design for maximum energy savings and computational accuracy.

### Key Improvements

- **Performance:** 50% faster than previous generation

- **Optimization:** Specifically tuned for machine learning workloads

- **Efficiency:** Reduced power consumption by 30%

- **Thermal Management:** Significantly improved thermal efficiency

---

#### 📥 Technical Documentation

For a comprehensive analysis of our findings and detailed technical specifications, download our full technical report.

[Download Full Report →]()

[^1]: de Vries, A. (2023). The growing energy footprint of artificial intelligence. Joule, 7(10), 2191-2194.
[^2]: Patterson, D., Gonzalez, J., Hölzle, U., Le, Q., Liang, C., Munguia, L. M., ... & Dean, J. (2022). The Carbon Footprint of Machine Learning Training Will Plateau, Then Shrink. Computer, 55(7), 18-28.
[^3]: Luo, H., & Sun, W. (2024). Addition is All You Need for Energy-efficient Language Models. arXiv preprint arXiv:2410.00907.
