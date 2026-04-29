#include "json.hpp"
#include <iostream>

using json = nlohmann::json;

int main() {
    json j = {{"name", "test"}};
    std::cout << j.dump() << std::endl;
    return 0;
}
